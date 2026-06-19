pub mod system_intelligence;
pub mod ai_analysis;
pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      commands::scan_dev_junk,
      commands::clean_dev_junk,
      commands::scan_github_repos,
      commands::optimize_local_repos,
      commands::get_system_health,
      commands::get_cpu_info,
      commands::get_memory_info,
      commands::get_disk_info,
      commands::get_process_list,
      commands::get_startup_items,
      commands::get_services_list,
      commands::optimize_system,
      commands::clean_junk_files,
      commands::get_ai_recommendations,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

pub mod autonomous_monitor;
