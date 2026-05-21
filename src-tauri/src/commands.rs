use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SystemHealth {
    pub score: u32,
    pub status: String,
    pub cpu_usage: f64,
    pub memory_usage: f64,
    pub disk_usage: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CPUInfo {
    pub cores: u32,
    pub threads: u32,
    pub usage_percent: f64,
    pub temperature: f64,
    pub frequency_mhz: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MemoryInfo {
    pub total_gb: f64,
    pub used_gb: f64,
    pub available_gb: f64,
    pub usage_percent: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DiskInfo {
    pub name: String,
    pub total_gb: f64,
    pub used_gb: f64,
    pub available_gb: f64,
    pub usage_percent: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub cpu_percent: f64,
    pub memory_mb: f64,
    pub gpu_percent: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StartupItem {
    pub name: String,
    pub path: String,
    pub enabled: bool,
    pub startup_delay_ms: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ServiceInfo {
    pub name: String,
    pub status: String,
    pub enabled: bool,
    pub cpu_percent: f64,
    pub memory_mb: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AIRecommendation {
    pub title: String,
    pub description: String,
    pub priority: String,
    pub recommendation: String,
    pub potential_impact: String,
}

#[tauri::command]
pub async fn get_system_health() -> Result<SystemHealth, String> {
    Ok(SystemHealth {
        score: 92,
        status: "Excellent".to_string(),
        cpu_usage: 23.5,
        memory_usage: 68.2,
        disk_usage: 42.1,
    })
}

#[tauri::command]
pub async fn get_cpu_info() -> Result<CPUInfo, String> {
    Ok(CPUInfo {
        cores: 4,
        threads: 8,
        usage_percent: 23.5,
        temperature: 52.0,
        frequency_mhz: 3600.0,
    })
}

#[tauri::command]
pub async fn get_memory_info() -> Result<MemoryInfo, String> {
    Ok(MemoryInfo {
        total_gb: 16.0,
        used_gb: 10.8,
        available_gb: 5.2,
        usage_percent: 67.5,
    })
}

#[tauri::command]
pub async fn get_disk_info() -> Result<Vec<DiskInfo>, String> {
    Ok(vec![
        DiskInfo {
            name: "Macintosh SSD".to_string(),
            total_gb: 1000.0,
            used_gb: 420.0,
            available_gb: 580.0,
            usage_percent: 42.0,
        },
        DiskInfo {
            name: "External Drive".to_string(),
            total_gb: 2000.0,
            used_gb: 780.0,
            available_gb: 1220.0,
            usage_percent: 39.0,
        },
    ])
}

#[tauri::command]
pub async fn get_process_list() -> Result<Vec<ProcessInfo>, String> {
    Ok(vec![
        ProcessInfo {
            pid: 1234,
            name: "Google Chrome".to_string(),
            cpu_percent: 23.4,
            memory_mb: 1856.0,
            gpu_percent: 12.3,
        },
        ProcessInfo {
            pid: 5678,
            name: "Visual Studio Code".to_string(),
            cpu_percent: 8.2,
            memory_mb: 892.0,
            gpu_percent: 5.1,
        },
        ProcessInfo {
            pid: 9012,
            name: "Finder".to_string(),
            cpu_percent: 2.1,
            memory_mb: 234.0,
            gpu_percent: 0.8,
        },
    ])
}

#[tauri::command]
pub async fn get_startup_items() -> Result<Vec<StartupItem>, String> {
    Ok(vec![
        StartupItem {
            name: "Google Chrome".to_string(),
            path: "/Applications/Google Chrome.app".to_string(),
            enabled: true,
            startup_delay_ms: 2300,
        },
        StartupItem {
            name: "Slack".to_string(),
            path: "/Applications/Slack.app".to_string(),
            enabled: true,
            startup_delay_ms: 1800,
        },
        StartupItem {
            name: "Spotify".to_string(),
            path: "/Applications/Spotify.app".to_string(),
            enabled: false,
            startup_delay_ms: 1200,
        },
    ])
}

#[tauri::command]
pub async fn get_services_list() -> Result<Vec<ServiceInfo>, String> {
    Ok(vec![
        ServiceInfo {
            name: "Bluetooth Daemon".to_string(),
            status: "running".to_string(),
            enabled: true,
            cpu_percent: 0.2,
            memory_mb: 12.0,
        },
        ServiceInfo {
            name: "Network Manager".to_string(),
            status: "running".to_string(),
            enabled: true,
            cpu_percent: 0.5,
            memory_mb: 34.0,
        },
        ServiceInfo {
            name: "Audio Service".to_string(),
            status: "running".to_string(),
            enabled: true,
            cpu_percent: 0.1,
            memory_mb: 8.0,
        },
    ])
}

#[tauri::command]
pub async fn optimize_system() -> Result<String, String> {
    Ok("Optimization started. Please wait...".to_string())
}

#[tauri::command]
pub async fn clean_junk_files() -> Result<String, String> {
    Ok("Cleaning junk files...".to_string())
}

#[tauri::command]
pub async fn get_ai_recommendations() -> Result<Vec<AIRecommendation>, String> {
    Ok(vec![
        AIRecommendation {
            title: "Chrome Using Excessive Memory".to_string(),
            description: "Google Chrome is consuming 2.1 GB of RAM".to_string(),
            priority: "high".to_string(),
            recommendation: "Close unused tabs or switch to Safari".to_string(),
            potential_impact: "Could free up ~800 MB RAM".to_string(),
        },
        AIRecommendation {
            title: "Background App Refresh Enabled".to_string(),
            description: "Multiple applications are running in background".to_string(),
            priority: "medium".to_string(),
            recommendation: "Disable background refresh for unused apps".to_string(),
            potential_impact: "Could improve battery life by 15%".to_string(),
        },
        AIRecommendation {
            title: "Startup Items Slowing Boot".to_string(),
            description: "You have 8 applications starting at boot".to_string(),
            priority: "medium".to_string(),
            recommendation: "Disable unnecessary startup items".to_string(),
            potential_impact: "Could reduce boot time by 12s".to_string(),
        },
    ])
}
