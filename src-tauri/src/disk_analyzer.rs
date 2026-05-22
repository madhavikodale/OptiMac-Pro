use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

// ─── Types ───────────────────────────────────────────────────────────

#[derive(Serialize, Clone, Debug)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub is_dir: bool,
    pub children: Vec<FileNode>,
}

#[derive(Serialize, Clone, Debug)]
pub struct TreemapNode {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub children: Vec<TreemapNode>,
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

// ─── Build tree (depth-limited) ─────────────────────────────────────

fn build_tree(path: &Path, depth: usize, max_depth: usize) -> FileNode {
    let name = path
        .file_name()
        .unwrap_or(path.as_os_str())
        .to_string_lossy()
        .to_string();
    let path_str = path.to_string_lossy().to_string();
    let is_dir = path.is_dir();

    let mut children = Vec::new();

    if is_dir && depth < max_depth {
        if let Ok(entries) = fs::read_dir(path) {
            let mut entries: Vec<_> = entries.flatten().collect();
            entries.sort_by(|a, b| {
                let sa = calculate_size(&a.path());
                let sb = calculate_size(&b.path());
                sb.cmp(&sa)
            });
            for entry in entries.into_iter().take(50) {
                children.push(build_tree(&entry.path(), depth + 1, max_depth));
            }
        }
    }

    let size = if is_dir {
        children.iter().map(|c| c.size).sum()
    } else {
        calculate_size(path)
    };

    FileNode {
        name,
        path: path_str,
        size,
        is_dir,
        children,
    }
}

// ─── Flatten to treemap format ──────────────────────────────────────

fn to_treemap(node: &FileNode) -> TreemapNode {
    TreemapNode {
        name: node.name.clone(),
        path: node.path.clone(),
        size: node.size,
        children: node.children.iter().map(to_treemap).collect(),
    }
}

// ─── Public API ──────────────────────────────────────────────────────

pub fn analyze_disk(path: &str, max_depth: usize) -> TreemapNode {
    let root = build_tree(Path::new(path), 0, max_depth);
    to_treemap(&root)
}

pub fn get_large_files(path: &str, min_size_mb: u64) -> Vec<FileNode> {
    let mut results = Vec::new();
    let min_bytes = min_size_mb * 1024 * 1024;

    fn scan(path: &Path, min: u64, results: &mut Vec<FileNode>) {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let p = entry.path();
                if p.is_file() {
                    let size = calculate_size(&p);
                    if size >= min {
                        results.push(FileNode {
                            name: p.file_name().unwrap_or_default().to_string_lossy().to_string(),
                            path: p.to_string_lossy().to_string(),
                            size,
                            is_dir: false,
                            children: vec![],
                        });
                    }
                } else if p.is_dir() {
                    scan(&p, min, results);
                }
            }
        }
    }

    scan(Path::new(path), min_bytes, &mut results);
    results.sort_by(|a, b| b.size.cmp(&a.size));
    results.into_iter().take(100).collect()
}

pub fn get_directory_summary(path: &str) -> Vec<(String, u64, usize)> {
    let mut summary = Vec::new();
    let root = Path::new(path);

    if let Ok(entries) = fs::read_dir(root) {
        for entry in entries.flatten() {
            let p = entry.path();
            let name = p.file_name().unwrap_or_default().to_string_lossy().to_string();
            let size = calculate_size(&p);
            let mut file_count = 0usize;

            if p.is_dir() {
                fn count_files(path: &Path) -> usize {
                    let mut count = 0;
                    if let Ok(entries) = fs::read_dir(path) {
                        for e in entries.flatten() {
                            let p = e.path();
                            if p.is_file() {
                                count += 1;
                            } else if p.is_dir() {
                                count += count_files(&p);
                            }
                        }
                    }
                    count
                }
                file_count = count_files(&p);
            } else {
                file_count = 1;
            }

            summary.push((name, size, file_count));
        }
    }

    summary.sort_by(|a, b| b.1.cmp(&a.1));
    summary
}
