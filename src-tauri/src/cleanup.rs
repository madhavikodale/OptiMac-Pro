use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

// ─── Types ───────────────────────────────────────────────────────────

#[derive(Serialize, Clone, Debug)]
pub struct CleanupCategory {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub color: String,
    pub size_bytes: u64,
    pub file_count: u64,
    pub paths: Vec<String>,
    pub protected: bool,
}

#[derive(Serialize, Clone, Debug)]
pub struct CleanupResult {
    pub categories: Vec<CleanupCategory>,
    pub total_size: u64,
    pub total_files: u64,
}

#[derive(Serialize, Clone, Debug)]
pub struct CleanupActionResult {
    pub success: bool,
    pub freed_bytes: u64,
    pub message: String,
    pub details: Vec<String>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct CleanupRequest {
    pub category_ids: Vec<String>,
    pub dry_run: bool,
}

// ─── Protected paths (never touch these) ─────────────────────────────

fn is_protected_path(path: &Path) -> bool {
    let protected = [
        "/System",
        "/usr",
        "/bin",
        "/sbin",
        "/dev",
        "/proc",
        "/var/db",
        "/private/var/db",
        "/Library/Preferences/SystemConfiguration",
    ];
    let path_str = path.to_string_lossy();
    protected.iter().any(|p| path_str.starts_with(*p))
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

fn count_files(path: &Path) -> u64 {
    if path.is_file() {
        1
    } else if path.is_dir() {
        let mut count = 0u64;
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                count += count_files(&entry.path());
            }
        }
        count
    } else {
        0
    }
}

// ─── Trash helper (move to trash via AppleScript) ───────────────────

fn move_to_trash(path: &str) -> Result<(), String> {
    let script = format!(r#"tell application "Finder" to delete POSIX file "{}""#, path);
    Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

// ─── Operation logging ──────────────────────────────────────────────

fn log_operation(action: &str, path: &str, size: u64, dry_run: bool) {
    let home = std::env::var("HOME").unwrap_or_default();
    let log_dir = PathBuf::from(&home).join("Library/Logs/OptiMacPro");
    let _ = fs::create_dir_all(&log_dir);
    let log_file = log_dir.join("operations.log");

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    let mode = if dry_run { "[DRY-RUN]" } else { "[EXECUTED]" };
    let entry = format!(
        "[{}] {} {} | path={} | size={} bytes\n",
        now, mode, action, path, size
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

// ─── Category scanners ──────────────────────────────────────────────

fn scan_user_caches() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let cache_root = PathBuf::from(&home).join("Library/Caches");
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    if let Ok(entries) = fs::read_dir(&cache_root) {
        for entry in entries.flatten() {
            let path = entry.path();
            if is_protected_path(&path) {
                continue;
            }
            let s = calculate_size(&path);
            let c = count_files(&path);
            if s > 0 {
                size += s;
                count += c;
                paths.push(path.to_string_lossy().to_string());
            }
        }
    }

    CleanupCategory {
        id: "user_caches".to_string(),
        name: "User App Caches".to_string(),
        description: "Application caches and temporary data".to_string(),
        icon: "folder".to_string(),
        color: "#06b6d4".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_browser_caches() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    let browser_paths = [
        ("Chrome", format!("{}/Library/Caches/Google/Chrome", home)),
        ("Chrome Canary", format!("{}/Library/Caches/Google/Chrome Canary", home)),
        ("Safari", format!("{}/Library/Caches/com.apple.Safari", home)),
        ("Firefox", format!("{}/Library/Caches/Firefox", home)),
        ("Edge", format!("{}/Library/Caches/Microsoft Edge", home)),
        ("Brave", format!("{}/Library/Caches/BraveSoftware", home)),
        ("Opera", format!("{}/Library/Caches/com.operasoftware.Opera", home)),
    ];

    for (name, path_str) in browser_paths {
        let path = PathBuf::from(&path_str);
        if path.exists() {
            let s = calculate_size(&path);
            let c = count_files(&path);
            if s > 0 {
                size += s;
                count += c;
                paths.push(format!("{}: {}", name, path_str));
            }
        }
    }

    CleanupCategory {
        id: "browser_caches".to_string(),
        name: "Browser Caches".to_string(),
        description: "Chrome, Safari, Firefox, Edge caches and web data".to_string(),
        icon: "globe".to_string(),
        color: "#8b5cf6".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_dev_tools() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    let dev_paths = [
        ("Xcode Derived Data", format!("{}/Library/Developer/Xcode/DerivedData", home)),
        ("Xcode Archives", format!("{}/Library/Developer/Xcode/Archives", home)),
        ("Xcode Device Support", format!("{}/Library/Developer/Xcode/iOS DeviceSupport", home)),
        ("Simulator Runtimes", format!("{}/Library/Developer/CoreSimulator/Caches/dyld", home)),
        ("npm Cache", format!("{}/.npm", home)),
        ("yarn Cache", format!("{}/Library/Caches/yarn", home)),
        ("pnpm Cache", format!("{}/Library/Caches/pnpm", home)),
        ("CocoaPods", format!("{}/Library/Caches/CocoaPods", home)),
        ("Gradle Cache", format!("{}/.gradle/caches", home)),
        ("Maven Cache", format!("{}/.m2/repository", home)),
        ("Rust Cache", format!("{}/.cargo/registry/cache", home)),
        ("Dart/Flutter", format!("{}/.pub-cache", home)),
        ("Docker", format!("{}/Library/Containers/com.docker.docker/Data/vms", home)),
    ];

    for (name, path_str) in dev_paths {
        let path = PathBuf::from(&path_str);
        if path.exists() {
            let s = calculate_size(&path);
            let c = count_files(&path);
            if s > 0 {
                size += s;
                count += c;
                paths.push(format!("{}: {}", name, path_str));
            }
        }
    }

    CleanupCategory {
        id: "dev_tools".to_string(),
        name: "Developer Tools".to_string(),
        description: "Xcode, npm, Docker, Gradle, Maven caches".to_string(),
        icon: "code".to_string(),
        color: "#f59e0b".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_system_logs() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    let log_paths = [
        ("User Logs", format!("{}/Library/Logs", home)),
        ("Diagnostic Reports", format!("{}/Library/Logs/DiagnosticReports", home)),
        ("Crash Reports", format!("{}/Library/Logs/CrashReporter", home)),
    ];

    for (name, path_str) in log_paths {
        let path = PathBuf::from(&path_str);
        if path.exists() {
            let s = calculate_size(&path);
            let c = count_files(&path);
            if s > 0 {
                size += s;
                count += c;
                paths.push(format!("{}: {}", name, path_str));
            }
        }
    }

    CleanupCategory {
        id: "system_logs".to_string(),
        name: "System Logs".to_string(),
        description: "Diagnostic, crash, and application logs".to_string(),
        icon: "file-text".to_string(),
        color: "#ef4444".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_app_specific() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    let app_paths = [
        ("Spotify", format!("{}/Library/Caches/com.spotify.client", home)),
        ("Slack", format!("{}/Library/Caches/com.tinyspeck.slackmacgap", home)),
        ("Discord", format!("{}/Library/Caches/com.hnc.Discord", home)),
        ("Dropbox", format!("{}/Library/Caches/com.getdropbox.dropbox", home)),
        ("Telegram", format!("{}/Library/Caches/ru.keepcoder.Telegram", home)),
        ("VS Code", format!("{}/Library/Caches/com.microsoft.VSCode", home)),
        ("JetBrains", format!("{}/Library/Caches/JetBrains", home)),
        ("Zoom", format!("{}/Library/Caches/us.zoom.xos", home)),
        ("Teams", format!("{}/Library/Caches/com.microsoft.teams", home)),
        ("Figma", format!("{}/Library/Caches/com.figma.Desktop", home)),
        ("Notion", format!("{}/Library/Caches/notion.id", home)),
        ("Postman", format!("{}/Library/Caches/com.postmanlabs.mac", home)),
    ];

    for (name, path_str) in app_paths {
        let path = PathBuf::from(&path_str);
        if path.exists() {
            let s = calculate_size(&path);
            let c = count_files(&path);
            if s > 0 {
                size += s;
                count += c;
                paths.push(format!("{}: {}", name, path_str));
            }
        }
    }

    CleanupCategory {
        id: "app_specific".to_string(),
        name: "App-Specific Caches".to_string(),
        description: "Spotify, Slack, Discord, Dropbox, and more".to_string(),
        icon: "package".to_string(),
        color: "#10b981".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_trash() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let trash_path = PathBuf::from(&home).join(".Trash");
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    if trash_path.exists() {
        size = calculate_size(&trash_path);
        count = count_files(&trash_path);
        if let Ok(entries) = fs::read_dir(&trash_path) {
            for entry in entries.flatten() {
                paths.push(entry.path().to_string_lossy().to_string());
            }
        }
    }

    CleanupCategory {
        id: "trash".to_string(),
        name: "Trash".to_string(),
        description: "Files in your Trash bin".to_string(),
        icon: "trash".to_string(),
        color: "#f97316".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_downloads() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let downloads = PathBuf::from(&home).join("Downloads");
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    if downloads.exists() {
        if let Ok(entries) = fs::read_dir(&downloads) {
            for entry in entries.flatten() {
                let path = entry.path();
                let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
                if ["dmg", "pkg", "zip", "tar", "gz", "bz2", "7z", "rar"].contains(&ext.as_str()) {
                    let s = calculate_size(&path);
                    if s > 0 {
                        size += s;
                        count += 1;
                        paths.push(path.to_string_lossy().to_string());
                    }
                }
            }
        }
    }

    CleanupCategory {
        id: "downloads".to_string(),
        name: "Installer Files".to_string(),
        description: "DMG, PKG, ZIP files in Downloads".to_string(),
        icon: "download".to_string(),
        color: "#ec4899".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_mail_attachments() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let mail_path = PathBuf::from(&home).join("Library/Mail");
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    if mail_path.exists() {
        if let Ok(entries) = fs::read_dir(&mail_path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    let attachments = path.join("Attachments");
                    if attachments.exists() {
                        let s = calculate_size(&attachments);
                        let c = count_files(&attachments);
                        if s > 0 {
                            size += s;
                            count += c;
                            paths.push(attachments.to_string_lossy().to_string());
                        }
                    }
                }
            }
        }
    }

    CleanupCategory {
        id: "mail_attachments".to_string(),
        name: "Mail Attachments".to_string(),
        description: "Downloaded email attachments".to_string(),
        icon: "mail".to_string(),
        color: "#3b82f6".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

fn scan_old_backups() -> CleanupCategory {
    let home = std::env::var("HOME").unwrap_or_default();
    let mut size = 0u64;
    let mut count = 0u64;
    let mut paths = Vec::new();

    // iOS device backups in Finder/iTunes
    let backup_path = PathBuf::from(&home).join("Library/Application Support/MobileSync/Backup");
    if backup_path.exists() {
        let s = calculate_size(&backup_path);
        let c = count_files(&backup_path);
        if s > 0 {
            size += s;
            count += c;
            paths.push(format!("iOS Backups: {}", backup_path.to_string_lossy()));
        }
    }

    CleanupCategory {
        id: "old_backups".to_string(),
        name: "Old Backups".to_string(),
        description: "iOS device backups and old snapshots".to_string(),
        icon: "hard-drive".to_string(),
        color: "#6366f1".to_string(),
        size_bytes: size,
        file_count: count,
        paths,
        protected: false,
    }
}

// ─── Public API ──────────────────────────────────────────────────────

pub fn scan_all_categories() -> CleanupResult {
    let categories = vec![
        scan_user_caches(),
        scan_browser_caches(),
        scan_dev_tools(),
        scan_system_logs(),
        scan_app_specific(),
        scan_trash(),
        scan_downloads(),
        scan_mail_attachments(),
        scan_old_backups(),
    ];

    let total_size = categories.iter().map(|c| c.size_bytes).sum();
    let total_files = categories.iter().map(|c| c.file_count).sum();

    CleanupResult {
        categories,
        total_size,
        total_files,
    }
}

pub fn run_cleanup(request: CleanupRequest) -> CleanupActionResult {
    let scan = scan_all_categories();
    let mut freed = 0u64;
    let mut details = Vec::new();

    for cat in &scan.categories {
        if !request.category_ids.contains(&cat.id) {
            continue;
        }
        if cat.protected {
            details.push(format!("Skipped protected category: {}", cat.name));
            continue;
        }

        for path_str in &cat.paths {
            // Handle "Name: /path" format
            let actual_path = if path_str.contains(": ") {
                path_str.split(": ").nth(1).unwrap_or(path_str)
            } else {
                path_str
            };

            let path = PathBuf::from(actual_path);
            if !path.exists() || is_protected_path(&path) {
                continue;
            }

            let size = calculate_size(&path);

            log_operation("cleanup", actual_path, size, request.dry_run);

            if request.dry_run {
                details.push(format!(
                    "[DRY-RUN] Would clean {} ({})",
                    cat.name,
                    format_size(size)
                ));
            } else {
                if path.is_file() {
                    if let Err(e) = move_to_trash(actual_path) {
                        details.push(format!("Failed to trash {}: {}", actual_path, e));
                        continue;
                    }
                } else if path.is_dir() {
                    if let Err(e) = move_to_trash(actual_path) {
                        details.push(format!("Failed to trash {}: {}", actual_path, e));
                        continue;
                    }
                }
                freed += size;
                details.push(format!(
                    "Cleaned {}: {} ({})",
                    cat.name,
                    path.file_name().unwrap_or_default().to_string_lossy(),
                    format_size(size)
                ));
            }
        }
    }

    let message = if request.dry_run {
        format!(
            "Dry run complete. Would free {} across {} categories.",
            format_size(freed),
            request.category_ids.len()
        )
    } else {
        format!(
            "Cleanup complete! Freed {} of space.",
            format_size(freed)
        )
    };

    CleanupActionResult {
        success: true,
        freed_bytes: freed,
        message,
        details,
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
