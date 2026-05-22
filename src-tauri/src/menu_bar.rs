use serde::Serialize;
use std::process::Command;
use std::sync::{Arc, Mutex};
use sysinfo::{System, RefreshKind, CpuRefreshKind, MemoryRefreshKind};
use tauri::State;

// ─── Types ───────────────────────────────────────────────────────────

#[derive(Serialize, Clone, Debug)]
pub struct MenuBarStats {
    pub cpu_percent: f32,
    pub memory_used_gb: f32,
    pub memory_total_gb: f32,
    pub memory_percent: f32,
    pub network_down_mbps: f32,
    pub network_up_mbps: f32,
    pub top_process: String,
    pub top_process_cpu: f32,
    pub battery_percent: f32,
    pub is_charging: bool,
}

// ─── State ───────────────────────────────────────────────────────────

pub struct MenuBarState {
    pub sys: Mutex<System>,
    pub last_net_stats: Mutex<(u64, u64, std::time::Instant)>,
}

impl MenuBarState {
    pub fn new() -> Self {
        Self {
            sys: Mutex::new(System::new_all()),
            last_net_stats: Mutex::new((0, 0, std::time::Instant::now())),
        }
    }
}

// ─── Stats Calculator ────────────────────────────────────────────────

pub fn get_menu_bar_stats(state: State<'_, MenuBarState>) -> Result<MenuBarStats, String> {
    let mut sys = state.sys.lock().map_err(|e| e.to_string())?;

    sys.refresh_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything()),
    );

    // CPU
    let cpu_percent = sys.global_cpu_info().cpu_usage();

    // Memory
    let memory_used = sys.used_memory();
    let memory_total = sys.total_memory();
    let memory_used_gb = memory_used as f32 / 1024.0 / 1024.0;
    let memory_total_gb = memory_total as f32 / 1024.0 / 1024.0;
    let memory_percent = if memory_total > 0 {
        (memory_used as f32 / memory_total as f32) * 100.0
    } else {
        0.0
    };

    // Top process
    let mut top_process = "None".to_string();
    let mut top_process_cpu = 0.0f32;
    for process in sys.processes().values() {
        let usage = process.cpu_usage();
        if usage > top_process_cpu {
            top_process_cpu = usage;
            top_process = process.name().to_string();
        }
    }
    if top_process.len() > 20 {
        top_process = top_process[..20].to_string() + "...";
    }

    // Network (estimate from netstat)
    let mut net_down = 0.0f32;
    let mut net_up = 0.0f32;

    if let Ok(output) = Command::new("netstat").args(["-ib"]).output() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut total_in = 0u64;
        let mut total_out = 0u64;

        for line in stdout.lines().skip(1) {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 10 {
                if let (Ok(ibytes), Ok(obytes)) = (parts[6].parse::<u64>(), parts[9].parse::<u64>()) {
                    total_in += ibytes;
                    total_out += obytes;
                }
            }
        }

        let mut last = state.last_net_stats.lock().map_err(|e| e.to_string())?;
        let elapsed = last.2.elapsed().as_secs_f32();

        if elapsed > 0.0 && last.0 > 0 {
            net_down = ((total_in - last.0) as f32 / elapsed) / 1024.0 / 1024.0 * 8.0;
            net_up = ((total_out - last.1) as f32 / elapsed) / 1024.0 / 1024.0 * 8.0;
        }

        *last = (total_in, total_out, std::time::Instant::now());
    }

    // Battery
    let mut battery_percent = 100.0f32;
    let mut is_charging = true;

    if let Ok(output) = Command::new("pmset").args(["-g", "batt"]).output() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        for line in stdout.lines() {
            if line.contains('%') {
                if let Some(percent_str) = line.split('%').next() {
                    if let Some(num) = percent_str.split_whitespace().last() {
                        battery_percent = num.parse().unwrap_or(100.0);
                    }
                }
                is_charging = line.contains("AC Power") || line.contains("charging");
            }
        }
    }

    Ok(MenuBarStats {
        cpu_percent,
        memory_used_gb,
        memory_total_gb,
        memory_percent,
        network_down_mbps: net_down,
        network_up_mbps: net_up,
        top_process,
        top_process_cpu,
        battery_percent,
        is_charging,
    })
}

// ─── Tauri Command ───────────────────────────────────────────────────

#[tauri::command]
pub fn get_menu_bar_stats_cmd(state: State<'_, MenuBarState>) -> Result<MenuBarStats, String> {
    get_menu_bar_stats(state)
}

// ─── Setup placeholder ───────────────────────────────────────────────
// Tray API varies by Tauri version; this is a no-op for now.
// The stats command above can be polled by the frontend for a HUD view.

pub fn setup_menu_bar(_app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // Tray setup deferred — use frontend-based menu bar widget instead
    Ok(())
}
