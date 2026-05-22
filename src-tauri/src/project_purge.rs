use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::path::Path;

// ─── Types ───────────────────────────────────────────────────────────

#[derive(Serialize, Clone, Debug)]
pub struct ProjectArtifact {
    pub path: String,
    pub artifact_type: String,
    pub size: u64,
    pub file_count: usize,
}

#[derive(Deserialize, Clone, Debug)]
pub struct ProjectPurgeRequest {
    pub paths: Vec<String>,
    pub dry_run: bool,
    pub artifact_types: Vec<String>, // e.g. ["node_modules", "target", ".build"]
}

#[derive(Serialize, Clone, Debug)]
pub struct ProjectPurgeResult {
    pub artifacts: Vec<ProjectArtifact>,
    pub total_size: u64,
    pub total_count: usize,
    pub freed_size: u64,
    pub message: String,
}

// ─── Artifact Detectors ──────────────────────────────────────────────

fn is_node_modules(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "node_modules")
        .unwrap_or(false)
}

fn is_rust_target(path: &Path) -> bool {
    if !path.is_dir() {
        return false;
    }
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "target")
        .unwrap_or(false)
        && path.join(".rustc_info.json").exists()
}

fn is_python_venv(path: &Path) -> bool {
    if !path.is_dir() {
        return false;
    }
    let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
    if name != ".venv" && name != "venv" && name != "env" && name != ".env" {
        return false;
    }
    path.join("bin/python").exists()
        || path.join("Scripts/python.exe").exists()
        || path.join("pyvenv.cfg").exists()
}

fn is_xcode_build(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "build" || n == "DerivedData" || n == ".build")
        .unwrap_or(false)
}

fn is_docker_volume(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "volumes" || n == "overlay2")
        .unwrap_or(false)
        && path.join("metadata.db").exists()
}

fn is_gradle_build(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == ".gradle" || n == "build")
        .unwrap_or(false)
        && (path.join("wrapper").exists() || path.parent().map(|p| p.join("gradlew").exists()).unwrap_or(false))
}

fn is_cmake_build(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "cmake-build-debug" || n == "cmake-build-release" || n == "out" || n == "build")
        .unwrap_or(false)
}

fn is_go_cache(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "pkg" || n == "bin")
        .unwrap_or(false)
        && path.parent().map(|p| p.join("go.mod").exists()).unwrap_or(false)
}

fn is_jetbrains_idea(path: &Path) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == ".idea")
        .unwrap_or(false)
}

fn classify_artifact(path: &Path) -> Option<&'static str> {
    if is_node_modules(path) {
        return Some("node_modules");
    }
    if is_rust_target(path) {
        return Some("Rust target");
    }
    if is_python_venv(path) {
        return Some("Python venv");
    }
    if is_xcode_build(path) {
        return Some("Xcode build");
    }
    if is_docker_volume(path) {
        return Some("Docker volume");
    }
    if is_gradle_build(path) {
        return Some("Gradle build");
    }
    if is_cmake_build(path) {
        return Some("CMake build");
    }
    if is_go_cache(path) {
        return Some("Go cache");
    }
    if is_jetbrains_idea(path) {
        return Some("JetBrains .idea");
    }
    None
}

// ─── Size Calculator ─────────────────────────────────────────────────

fn calculate_size(path: &Path) -> (u64, usize) {
    let mut total = 0u64;
    let mut count = 0usize;

    if path.is_file() {
        total += path.metadata().map(|m| m.len()).unwrap_or(0);
        count += 1;
    } else if path.is_dir() {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let (s, c) = calculate_size(&entry.path());
                total += s;
                count += c;
            }
        }
    }

    (total, count)
}

// ─── Scanner ─────────────────────────────────────────────────────────

fn scan_for_artifacts(
    root: &Path,
    types: &HashSet<String>,
    found: &mut Vec<ProjectArtifact>,
    visited: &mut HashSet<String>,
) {
    let root_str = root.to_string_lossy().to_string();
    if !visited.insert(root_str.clone()) {
        return;
    }

    if let Some(artifact_type) = classify_artifact(root) {
        if types.is_empty() || types.contains(artifact_type) {
            let (size, file_count) = calculate_size(root);
            if size > 0 {
                found.push(ProjectArtifact {
                    path: root_str,
                    artifact_type: artifact_type.to_string(),
                    size,
                    file_count,
                });
            }
            // Don't recurse into known artifact dirs
            return;
        }
    }

    if root.is_dir() {
        if let Ok(entries) = fs::read_dir(root) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    scan_for_artifacts(&path, types, found, visited);
                }
            }
        }
    }
}

// ─── Trash helper ───────────────────────────────────────────────────

fn move_to_trash(path: &str) -> Result<(), String> {
    let script = format!(
        r#"tell application "Finder" to delete POSIX file "{}""#,
        path
    );
    std::process::Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

// ─── Public API ──────────────────────────────────────────────────────

pub fn scan_project_artifacts(paths: Vec<String>, types: Vec<String>) -> ProjectPurgeResult {
    let type_set: HashSet<String> = types.into_iter().collect();
    let mut found = Vec::new();
    let mut visited = HashSet::new();

    for path_str in paths {
        let path = Path::new(&path_str);
        if path.exists() {
            scan_for_artifacts(path, &type_set, &mut found, &mut visited);
        }
    }

    found.sort_by(|a, b| b.size.cmp(&a.size));

    let total_size = found.iter().map(|a| a.size).sum();
    let total_count = found.len();

    ProjectPurgeResult {
        artifacts: found,
        total_size,
        total_count,
        freed_size: 0,
        message: format!(
            "Found {} artifacts totaling {}.",
            total_count,
            format_size(total_size)
        ),
    }
}

pub fn purge_project_artifacts(request: ProjectPurgeRequest) -> ProjectPurgeResult {
    let mut result = scan_project_artifacts(request.paths.clone(), request.artifact_types.clone());

    if request.dry_run {
        result.message = format!(
            "[DRY-RUN] Would delete {} artifacts totaling {}.",
            result.total_count,
            format_size(result.total_size)
        );
        return result;
    }

    let mut freed = 0u64;
    for artifact in &result.artifacts {
        if move_to_trash(&artifact.path).is_ok() {
            freed += artifact.size;
        }
    }

    result.freed_size = freed;
    result.message = format!(
        "Purged {} artifacts. Freed {} of space.",
        result.total_count,
        format_size(freed)
    );

    result
}

fn format_size(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
    if bytes == 0 {
        return "0 B".to_string();
    }
    let exp = (bytes as f64).log(1024.0).min(UNITS.len() as f64 - 1.0) as usize;
    let size = bytes as f64 / 1024f64.powi(exp as i32);
    format!("{:.1} {}", size, UNITS[exp])
}
