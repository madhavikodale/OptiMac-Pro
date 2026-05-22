use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

// ─── Types ───────────────────────────────────────────────────────────

#[derive(Serialize, Clone, Debug)]
pub struct AppLeftover {
    pub path: String,
    pub category: String,
    pub size: u64,
}

#[derive(Serialize, Clone, Debug)]
pub struct SmartUninstallResult {
    pub app_name: String,
    pub app_path: String,
    pub app_size: u64,
    pub leftovers: Vec<AppLeftover>,
    pub total_leftover_size: u64,
}

#[derive(Serialize, Clone, Debug)]
pub struct UninstallActionResult {
    pub success: bool,
    pub freed_bytes: u64,
    pub message: String,
    pub removed_paths: Vec<String>,
    pub failed_paths: Vec<String>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct SmartUninstallRequest {
    pub app_path: String,
    pub bundle_id: String,
    pub app_name: String,
    pub dry_run: bool,
}

// ─── Size calculation ────────────────────────────────────────────────

fn calculate_size(path: &Path) -> u64 {
    if path.is_file() {
        fs::metadata(path).map(|m| m.len()).unwrap_or(0)
    } else if path.is_dir() {
        let mut total = 0u64;
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                total += calculate_size(&entry.path());
            }
        }
        total
    } else {
        0
    }
}

// ─── Trash helper ───────────────────────────────────────────────────

fn move_to_trash(path: &str) -> Result<(), String> {
    let script = format!(r#"tell application "Finder" to delete POSIX file "{}""#, path);
    Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

// ─── Find leftovers by bundle ID ────────────────────────────────────

fn find_leftovers_by_bundle_id(bundle_id: &str, app_name: &str) -> Vec<AppLeftover> {
    let mut leftovers = Vec::new();
    let home = std::env::var("HOME").unwrap_or_default();

    // Build search patterns
    let bundle_patterns: Vec<String> = if bundle_id.is_empty() {
        vec![]
    } else {
        let parts: Vec<&str> = bundle_id.split('.').collect();
        let mut patterns = vec![bundle_id.to_string()];
        if parts.len() >= 2 {
            patterns.push(parts[..parts.len().min(3)].join("."));
        }
        patterns
    };

    let name_lower = app_name.to_lowercase();
    let name_variants: Vec<String> = vec![
        app_name.to_string(),
        name_lower.clone(),
        app_name.replace(" ", ""),
        app_name.replace(" ", "-"),
        app_name.replace(" ", "_"),
    ];

    // Search directories
    let search_dirs = [
        (format!("{}/Library/Application Support", home), "Application Support"),
        (format!("{}/Library/Caches", home), "Caches"),
        (format!("{}/Library/Preferences", home), "Preferences"),
        (format!("{}/Library/Logs", home), "Logs"),
        (format!("{}/Library/WebKit", home), "WebKit Storage"),
        (format!("{}/Library/Saved Application State", home), "Saved State"),
        (format!("{}/Library/Cookies", home), "Cookies"),
        (format!("{}/Library/Containers", home), "Containers"),
        (format!("{}/Library/Group Containers", home), "Group Containers"),
        ("/Library/Application Support".to_string(), "System App Support"),
        ("/Library/Preferences".to_string(), "System Preferences"),
        ("/Library/LaunchAgents".to_string(), "LaunchAgents"),
        ("/Library/LaunchDaemons".to_string(), "LaunchDaemons"),
        (format!("{}/Library/PreferencePanes", home), "Preference Panes"),
        ("/Library/PreferencePanes".to_string(), "System Preference Panes"),
        (format!("{}/Library/Input Methods", home), "Input Methods"),
        (format!("{}/Library/QuickLook", home), "QuickLook Plugins"),
        (format!("{}/Library/Spotlight", home), "Spotlight Importers"),
        (format!("{}/Library/Services", home), "Services"),
        (format!("{}/Library/Audio/Plug-Ins", home), "Audio Plugins"),
        (format!("{}/Library/Contextual Menu Items", home), "Contextual Menu Items"),
    ];

    let mut found_paths = HashSet::new();

    for (dir_path, category) in search_dirs {
        let dir = PathBuf::from(&dir_path);
        if !dir.exists() {
            continue;
        }

        if let Ok(entries) = fs::read_dir(&dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                let name = path.file_name().unwrap_or_default().to_string_lossy();
                let name_str = name.to_string();

                // Check if matches bundle ID patterns
                let mut matched = false;
                for pattern in &bundle_patterns {
                    if name_str.contains(pattern) {
                        matched = true;
                        break;
                    }
                }

                // Check if matches app name variants
                if !matched {
                    for variant in &name_variants {
                        if name_str.to_lowercase().contains(&variant.to_lowercase()) {
                            matched = true;
                            break;
                        }
                    }
                }

                if matched {
                    let path_str = path.to_string_lossy().to_string();
                    if !found_paths.contains(&path_str) {
                        found_paths.insert(path_str.clone());
                        let size = calculate_size(&path);
                        if size > 0 {
                            leftovers.push(AppLeftover {
                                path: path_str,
                                category: category.to_string(),
                                size,
                            });
                        }
                    }
                }
            }
        }
    }

    // Sort by size (largest first)
    leftovers.sort_by(|a, b| b.size.cmp(&a.size));
    leftovers
}

// ─── Public API ──────────────────────────────────────────────────────

pub fn scan_app_leftovers(app_path: &str, bundle_id: &str, app_name: &str) -> SmartUninstallResult {
    let path = PathBuf::from(app_path);
    let app_size = calculate_size(&path);
    let leftovers = find_leftovers_by_bundle_id(bundle_id, app_name);
    let total_leftover_size = leftovers.iter().map(|l| l.size).sum();

    SmartUninstallResult {
        app_name: app_name.to_string(),
        app_path: app_path.to_string(),
        app_size,
        leftovers,
        total_leftover_size,
    }
}

pub fn run_smart_uninstall(request: SmartUninstallRequest) -> UninstallActionResult {
    let scan = scan_app_leftovers(&request.app_path, &request.bundle_id, &request.app_name);
    let mut freed = 0u64;
    let mut removed = Vec::new();
    let mut failed = Vec::new();

    // Log the operation
    let home = std::env::var("HOME").unwrap_or_default();
    let log_dir = PathBuf::from(&home).join("Library/Logs/OptiMacPro");
    let _ = fs::create_dir_all(&log_dir);
    let log_file = log_dir.join("operations.log");

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    let mode = if request.dry_run { "[DRY-RUN]" } else { "[EXECUTED]" };

    // Move app to trash
    if !request.dry_run {
        if let Err(e) = move_to_trash(&request.app_path) {
            failed.push(format!("App: {} - {}", request.app_path, e));
        } else {
            freed += scan.app_size;
            removed.push(request.app_path.clone());
        }
    }

    // Move leftovers to trash
    for leftover in &scan.leftovers {
        if request.dry_run {
            let entry = format!(
                "[{}] {} uninstall | path={} | size={} bytes | category={}\n",
                now, mode, leftover.path, leftover.size, leftover.category
            );
            let _ = fs::OpenOptions::new()
                .create(true)
                .append(true)
                .open(&log_file)
                .and_then(|mut f| {
                    use std::io::Write;
                    f.write_all(entry.as_bytes())
                });
            continue;
        }

        if let Err(e) = move_to_trash(&leftover.path) {
            failed.push(format!("{}: {}", leftover.path, e));
        } else {
            freed += leftover.size;
            removed.push(leftover.path.clone());
        }

        let entry = format!(
            "[{}] {} uninstall | path={} | size={} bytes | category={}\n",
            now, mode, leftover.path, leftover.size, leftover.category
        );
        let _ = fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_file)
            .and_then(|mut f| {
                use std::io::Write;
                f.write_all(entry.as_bytes())
            });
    }

    let message = if request.dry_run {
        format!(
            "Dry run: Would remove {} and {} leftover items ({} total)",
            request.app_name,
            scan.leftovers.len(),
            format_size(scan.app_size + scan.total_leftover_size)
        )
    } else {
        format!(
            "Uninstalled {} and removed {} leftover items. Freed {}.",
            request.app_name,
            removed.len().saturating_sub(1),
            format_size(freed)
        )
    };

    UninstallActionResult {
        success: failed.is_empty() || request.dry_run,
        freed_bytes: if request.dry_run { 0 } else { freed },
        message,
        removed_paths: removed,
        failed_paths: failed,
    }
}

fn format_size(bytes: u64) -> String {
    if bytes == 0 {
        return "0 B".to_string();
    }
    let k = 1024f64;
    let sizes = ["B", "KB", "MB", "GB", "TB"];
    let i = (bytes as f64).log(k).floor() as usize;
    let i = i.min(sizes.len() - 1);
    format!("{:.2} {}", bytes as f64 / k.powi(i as i32), sizes[i])
}
