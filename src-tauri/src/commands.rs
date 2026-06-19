use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, Duration};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DevJunkItem {
    pub id: String,
    pub name: String,
    pub category: String,
    pub path: String,
    pub size_bytes: u64,
    pub size_readable: String,
    pub selected: bool,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DevJunkScanResult {
    pub items: Vec<DevJunkItem>,
    pub total_size_bytes: u64,
    pub total_size_readable: String,
}

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

fn format_size(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
    let mut size = bytes as f64;
    let mut unit_idx = 0;
    while size >= 1024.0 && unit_idx < UNITS.len() - 1 {
        size /= 1024.0;
        unit_idx += 1;
    }
    format!("{:.1} {}", size, UNITS[unit_idx])
}

fn get_dir_size(path: &Path) -> u64 {
    let mut total = 0u64;
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let path = entry.path();
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_dir() {
                    total += get_dir_size(&path);
                } else {
                    total += metadata.len();
                }
            }
        }
    }
    total
}

fn is_older_than_days(path: &Path, days: u64) -> bool {
    if let Ok(metadata) = fs::metadata(path) {
        if let Ok(accessed) = metadata.accessed() {
            if let Ok(duration) = SystemTime::now().duration_since(accessed) {
                return duration > Duration::from_secs(days * 86400);
            }
        }
        if let Ok(modified) = metadata.modified() {
            if let Ok(duration) = SystemTime::now().duration_since(modified) {
                return duration > Duration::from_secs(days * 86400);
            }
        }
    }
    false
}

fn find_node_modules_dirs() -> Vec<PathBuf> {
    let mut results = Vec::new();
    let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/Users/digitone"));
    let search_roots = [
        home.join("Documents"),
        home.join("Projects"),
        home.join("Dev"),
        home.join("Development"),
        home.join("code"),
        home.join("workspace"),
    ];

    for root in &search_roots {
        if !root.exists() {
            continue;
        }
        fn walk(dir: &Path, results: &mut Vec<PathBuf>) {
            if let Ok(entries) = fs::read_dir(dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.file_name() == Some(std::ffi::OsStr::new("node_modules")) {
                        if is_older_than_days(&path, 30) {
                            results.push(path);
                        }
                        continue;
                    }
                    if path.is_dir() {
                        let name = path.file_name().unwrap_or_default().to_string_lossy();
                        if name.starts_with('.') || name == "node_modules" {
                            continue;
                        }
                        if results.len() > 50 {
                            return;
                        }
                        walk(&path, results);
                    }
                }
            }
        }
        walk(root, &mut results);
    }
    results
}

fn get_xcode_derived_data_size() -> u64 {
    let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/Users/digitone"));
    let path = home.join("Library/Developer/Xcode/DerivedData");
    if path.exists() {
        get_dir_size(&path)
    } else {
        0
    }
}

fn get_android_studio_cache_size() -> u64 {
    let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/Users/digitone"));
    let mut total = 0u64;
    if let Ok(entries) = fs::read_dir(home.join("Library/Caches")) {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with("Google/AndroidStudio") || name.starts_with("android") {
                let path = entry.path();
                if path.is_dir() {
                    total += get_dir_size(&path);
                }
            }
        }
    }
    total
}

fn get_docker_size() -> u64 {
    let output = Command::new("docker")
        .args(["system", "df", "--format", "{{.Size}}"])
        .output();
    
    if let Ok(output) = output {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let mut total = 0u64;
            for line in stdout.lines() {
                let line = line.trim();
                if line.is_empty() {
                    continue;
                }
                let parts: Vec<&str> = line.split_whitespace().collect();
                if let Some(size_str) = parts.first() {
                    let size = size_str.parse::<f64>().unwrap_or(0.0);
                    total += (size * 1024.0 * 1024.0 * 1024.0) as u64;
                }
            }
            return total;
        }
    }
    0
}

#[tauri::command]
pub async fn scan_dev_junk() -> Result<DevJunkScanResult, String> {
    let mut items = Vec::new();
    let mut total_size = 0u64;

    let xcode_size = get_xcode_derived_data_size();
    if xcode_size > 0 {
        total_size += xcode_size;
        items.push(DevJunkItem {
            id: "xcode-derived".to_string(),
            name: "Xcode Derived Data".to_string(),
            category: "xcode".to_string(),
            path: "~/Library/Developer/Xcode/DerivedData".to_string(),
            size_bytes: xcode_size,
            size_readable: format_size(xcode_size),
            selected: true,
            description: "Build artifacts, indexes, and intermediate files from Xcode builds".to_string(),
        });
    }

    let node_modules_dirs = find_node_modules_dirs();
    let mut node_modules_size = 0u64;
    for dir in &node_modules_dirs {
        node_modules_size += get_dir_size(dir);
    }
    if node_modules_size > 0 {
        total_size += node_modules_size;
        items.push(DevJunkItem {
            id: "node-modules".to_string(),
            name: format!("Node.js Modules ({} found)", node_modules_dirs.len()),
            category: "nodejs".to_string(),
            path: "Various project directories".to_string(),
            size_bytes: node_modules_size,
            size_readable: format_size(node_modules_size),
            selected: true,
            description: format!("{} node_modules folders unused for 30+ days", node_modules_dirs.len()),
        });
    }

    let android_size = get_android_studio_cache_size();
    if android_size > 0 {
        total_size += android_size;
        items.push(DevJunkItem {
            id: "android-cache".to_string(),
            name: "Android Studio Build Cache".to_string(),
            category: "android".to_string(),
            path: "~/Library/Caches/Google/AndroidStudio*".to_string(),
            size_bytes: android_size,
            size_readable: format_size(android_size),
            selected: true,
            description: "Gradle build cache and Android Studio temporary files".to_string(),
        });
    }

    let docker_size = get_docker_size();
    if docker_size > 0 {
        total_size += docker_size;
        items.push(DevJunkItem {
            id: "docker".to_string(),
            name: "Docker System Data".to_string(),
            category: "docker".to_string(),
            path: "Docker daemon storage".to_string(),
            size_bytes: docker_size,
            size_readable: format_size(docker_size),
            selected: false,
            description: "Stopped containers, unused images, and build cache".to_string(),
        });
    }

    Ok(DevJunkScanResult {
        items,
        total_size_bytes: total_size,
        total_size_readable: format_size(total_size),
    })
}

#[tauri::command]
pub async fn clean_dev_junk(selected_ids: Vec<String>) -> Result<DevJunkScanResult, String> {
    let scan = scan_dev_junk().await?;
    let mut cleaned_size = 0u64;

    for item in &scan.items {
        if !selected_ids.contains(&item.id) {
            continue;
        }

        match item.category.as_str() {
            "xcode" => {
                let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/Users/digitone"));
                let path = home.join("Library/Developer/Xcode/DerivedData");
                if path.exists() {
                    let _ = fs::remove_dir_all(&path);
                    let _ = fs::create_dir_all(&path);
                    cleaned_size += item.size_bytes;
                }
            }
            "nodejs" => {
                let dirs = find_node_modules_dirs();
                for dir in dirs {
                    let _ = fs::remove_dir_all(&dir);
                    cleaned_size += get_dir_size(&dir);
                }
            }
            "android" => {
                let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/Users/digitone"));
                if let Ok(entries) = fs::read_dir(home.join("Library/Caches")) {
                    for entry in entries.flatten() {
                        let name = entry.file_name().to_string_lossy().to_string();
                        if name.starts_with("Google/AndroidStudio") || name.starts_with("android") {
                            let path = entry.path();
                            if path.is_dir() {
                                let _ = fs::remove_dir_all(&path);
                            }
                        }
                    }
                }
                cleaned_size += item.size_bytes;
            }
            "docker" => {
                let _ = Command::new("docker")
                    .args([
                        "system", "prune", "-f", "--volumes"
                    ])
                    .output();
                cleaned_size += item.size_bytes;
            }
            _ => {}
        }
    }

    let result = scan_dev_junk().await?;
    Ok(DevJunkScanResult {
        items: result.items,
        total_size_bytes: result.total_size_bytes,
        total_size_readable: result.total_size_readable,
    })
}
