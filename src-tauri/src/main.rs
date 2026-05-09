#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use sysinfo::{System, Disks};
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Clone)]
struct SystemStats {
    cpu_usage: f32,
    memory_usage: f32,
    memory_total: u64,
    memory_used: u64,
    disk_usage: f32,
    disk_total: u64,
    disk_used: u64,
    temperature: f32,
    uptime: u64,
    battery_health: f32,
    network_up: f32,
    network_down: f32,
}

#[derive(Serialize, Deserialize, Clone)]
struct ProcessInfo {
    name: String,
    pid: u32,
    cpu_usage: f32,
    memory: u64,
}

struct AppState {
    sys: Mutex<System>,
}

fn get_battery_percentage() -> f32 {
    // Try to get battery info from macOS
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("pmset")
            .arg("-g")
            .arg("batt")
            .output()
        {
            if let Ok(s) = String::from_utf8(output.stdout) {
                for line in s.lines() {
                    if line.contains("%") {
                        if let Some(pos) = line.find('%') {
                            let start = line[..pos].rfind(char::is_whitespace).unwrap_or(0) + 1;
                            if let Ok(battery) = line[start..pos].parse::<f32>() {
                                return battery;
                            }
                        }
                    }
                }
            }
        }
    }
    50.0 // Fallback
}

#[tauri::command]
fn get_system_stats(state: tauri::State<AppState>) -> Result<SystemStats, String> {
    let mut sys = state.sys.lock().unwrap();
    sys.refresh_all();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    let memory_usage = (memory_used as f32 / memory_total as f32) * 100.0;

    let disks = Disks::new_with_refreshed_list();
    let mut disk_total = 0u64;
    let mut disk_used = 0u64;
    
    for disk in &disks {
        disk_total += disk.total_space();
        disk_used += disk.total_space() - disk.available_space();
    }
    
    let disk_usage = if disk_total > 0 {
        (disk_used as f32 / disk_total as f32) * 100.0
    } else {
        0.0
    };

    Ok(SystemStats {
        cpu_usage,
        memory_usage,
        memory_total,
        memory_used,
        disk_usage,
        disk_total,
        disk_used,
        temperature: 52.0,
        uptime: System::uptime(),
        battery_health: get_battery_percentage(),
        network_up: 8.4,
        network_down: 32.6,
    })
}

#[tauri::command]
fn get_top_processes(state: tauri::State<AppState>, limit: usize) -> Result<Vec<ProcessInfo>, String> {
    let mut sys = state.sys.lock().unwrap();
    sys.refresh_all();

    let mut processes: Vec<ProcessInfo> = sys.processes()
        .iter()
        .map(|(_, process)| ProcessInfo {
            name: process.name().to_string(),
            pid: process.pid().as_u32(),
            cpu_usage: process.cpu_usage(),
            memory: process.memory(),
        })
        .collect();

    processes.sort_by(|a, b| b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap());
    processes.truncate(limit);

    Ok(processes)
}

fn main() {
    let sys = System::new_all();
    let app_state = AppState {
        sys: Mutex::new(sys),
    };

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![get_system_stats, get_top_processes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
