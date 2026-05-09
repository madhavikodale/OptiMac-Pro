use tauri::State;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SystemMetrics {
    pub cpu: CpuMetrics,
    pub memory: MemoryMetrics,
    pub disk: DiskMetrics,
    pub power: PowerMetrics,
    pub network: NetworkMetrics,
    pub processes: Vec<ProcessInfo>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CpuMetrics {
    pub total: f64,
    pub cores: Vec<f64>,
    pub temp: f64,
    pub load: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MemoryMetrics {
    pub used: f64,
    pub free: f64,
    pub swap: f64,
    pub total: f64,
    pub avail: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DiskMetrics {
    pub intr: f64,
    pub read: f64,
    pub write: f64,
    pub total: u64,
    pub used: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PowerMetrics {
    pub level: f64,
    pub health: f64,
    pub status: String,
    pub time: String,
    pub watts: f64,
    pub temp: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NetworkMetrics {
    pub down: f64,
    pub up: f64,
    pub ip: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcessInfo {
    pub name: String,
    pub cpu: f64,
    pub mem: f64,
}

pub struct AppState {
    pub metrics: Mutex<SystemMetrics>,
}

#[tauri::command]
fn get_system_metrics(state: State<AppState>) -> SystemMetrics {
    let metrics = state.metrics.lock().unwrap();
    metrics.clone()
}

#[tauri::command]
fn update_system_metrics(state: State<AppState>) -> SystemMetrics {
    let metrics = fetch_system_data();
    *state.metrics.lock().unwrap() = metrics.clone();
    metrics
}

fn fetch_system_data() -> SystemMetrics {
    // TODO: Implement actual system data fetching
    // For now, return mock data
    SystemMetrics {
        cpu: CpuMetrics {
            total: 23.2,
            cores: vec![55.0, 52.4, 45.0, 38.2],
            temp: 30.8,
            load: "5.79 / 9.50 / 9.60".to_string(),
        },
        memory: MemoryMetrics {
            used: 81.0,
            free: 19.0,
            swap: 89.4,
            total: 13.0,
            avail: 3.0,
        },
        disk: DiskMetrics {
            intr: 94.0,
            read: 55.4,
            write: 0.4,
            total: 433,
            used: 406,
        },
        power: PowerMetrics {
            level: 99.0,
            health: 78.0,
            status: "Discharging".to_string(),
            time: "1:59".to_string(),
            watts: 27.0,
            temp: 30.8,
        },
        network: NetworkMetrics {
            down: 0.01,
            up: 0.35,
            ip: "192.168.1.110".to_string(),
        },
        processes: vec![
            ProcessInfo {
                name: "WindowServer".to_string(),
                cpu: 44.6,
                mem: 12.5,
            },
            ProcessInfo {
                name: "logoptionsd".to_string(),
                cpu: 29.5,
                mem: 8.3,
            },
            ProcessInfo {
                name: "Python".to_string(),
                cpu: 14.1,
                mem: 5.2,
            },
        ],
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_metrics = fetch_system_data();
    
    tauri::Builder::default()
        .manage(AppState {
            metrics: Mutex::new(initial_metrics),
        })
        .invoke_handler(tauri::generate_handler![
            get_system_metrics,
            update_system_metrics
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
