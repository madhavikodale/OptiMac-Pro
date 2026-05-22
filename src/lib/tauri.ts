import { invoke } from '@tauri-apps/api/core'

export interface CpuInfo {
  usage: number
  cores: number
  brand: string
  frequency: number
}

export interface MemoryInfo {
  total: number
  used: number
  free: number
  usage_percent: number
}

export interface DiskInfo {
  name: string
  mount_point: string
  total: number
  used: number
  free: number
  usage_percent: number
  kind: string
}

export interface NetworkInfo {
  interface_name: string
  rx_bytes: number
  tx_bytes: number
  rx_errors: number
  tx_errors: number
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu_usage: number
  memory_mb: number
  status: string
}

export interface SystemInfo {
  hostname: string
  os_version: string
  kernel_version: string
  uptime: number
  cpu: CpuInfo
  memory: MemoryInfo
  disks: DiskInfo[]
  networks: NetworkInfo[]
  processes: ProcessInfo[]
}

export interface StartupItem {
  name: string
  path: string
  enabled: boolean
  kind: string
}

export interface BatteryInfo {
  has_battery: boolean
  health_percent: number
  cycle_count: number
  current_capacity: number
  design_capacity: number
  voltage: number
  temperature: number
  status: string
  time_remaining: string
}

export interface TemperatureInfo {
  sensor: string
  value: number
  unit: string
}

export interface FirewallRule {
  direction: string
  action: string
  protocol: string
  port: string
  app: string
}

export interface FirewallStatus {
  enabled: boolean
  stealth_mode: boolean
  rules: FirewallRule[]
}

export interface InstalledApp {
  name: string
  version: string
  path: string
  size: number
  icon: string
  bundle_id: string
}

export interface SpeedTestResult {
  ping_ms: number
  download_mbps: number
  upload_mbps: number
  jitter_ms: number
  server: string
}

export interface DuplicateFile {
  hash: string
  paths: string[]
  size: number
}

export interface MemoryPressure {
  pressure_level: string
  pages_active: number
  pages_inactive: number
  pages_wired: number
  pages_free: number
  swap_used: number
  swap_total: number
  compressions: number
  decompressions: number
}

export interface SmartData {
  disk_name: string
  overall_health: string
  temperature: number
  power_on_hours: number
  start_stop_count: number
  reallocated_sectors: number
  pending_sectors: number
  uncorrectable_errors: number
  wear_leveling: number
  life_remaining: number
}

export interface CleanupCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  size_bytes: number
  file_count: number
  paths: string[]
  protected: boolean
}

export interface CleanupResult {
  categories: CleanupCategory[]
  total_size: number
  total_files: number
}

export interface CleanupActionResult {
  success: boolean
  freed_bytes: number
  message: string
  details: string[]
}

export async function getSystemInfo(): Promise<SystemInfo> {
  return invoke('get_system_info')
}

export async function getCpuUsage(): Promise<number> {
  return invoke('get_cpu_usage')
}

export async function getMemoryInfo(): Promise<MemoryInfo> {
  return invoke('get_memory_info')
}

export async function getDiskInfo(): Promise<DiskInfo[]> {
  return invoke('get_disk_info')
}

export async function getNetworkInfo(): Promise<NetworkInfo[]> {
  return invoke('get_network_info')
}

export async function getProcesses(): Promise<ProcessInfo[]> {
  return invoke('get_processes')
}

export async function killProcess(pid: number): Promise<boolean> {
  return invoke('kill_process', { pid })
}

export async function runOptimization(task: string): Promise<string> {
  return invoke('run_optimization', { task })
}

export async function getStartupItems(): Promise<StartupItem[]> {
  return invoke('get_startup_items')
}

export async function removeStartupItem(name: string, kind: string): Promise<boolean> {
  return invoke('remove_startup_item', { name, kind })
}

export async function getBatteryInfo(): Promise<BatteryInfo> {
  return invoke('get_battery_info')
}

export async function getTemperatures(): Promise<TemperatureInfo[]> {
  return invoke('get_temperatures')
}

export async function getFirewallStatus(): Promise<FirewallStatus> {
  return invoke('get_firewall_status')
}

export async function getInstalledApps(): Promise<InstalledApp[]> {
  return invoke('get_installed_apps')
}

export async function uninstallApp(path: string): Promise<boolean> {
  return invoke('uninstall_app', { path })
}

export async function runSpeedTest(): Promise<SpeedTestResult> {
  return invoke('run_speed_test')
}

export async function getMemoryPressure(): Promise<MemoryPressure> {
  return invoke('get_memory_pressure')
}

export async function getSmartData(): Promise<SmartData[]> {
  return invoke('get_smart_data')
}

export async function findDuplicateFiles(path: string): Promise<DuplicateFile[]> {
  return invoke('find_duplicate_files', { path })
}

export async function scanCleanupCategories(): Promise<CleanupResult> {
  return invoke('scan_cleanup_categories')
}

export async function runDeepCleanup(categoryIds: string[], dryRun: boolean): Promise<CleanupActionResult> {
  return invoke('run_deep_cleanup', { categoryIds, dryRun })
}

export interface AppLeftover {
  path: string
  category: string
  size: number
}

export interface SmartUninstallResult {
  app_name: string
  app_path: string
  app_size: number
  leftovers: AppLeftover[]
  total_leftover_size: number
}

export interface UninstallActionResult {
  success: boolean
  freed_bytes: number
  message: string
  removed_paths: string[]
  failed_paths: string[]
}

export async function scanAppLeftovers(appPath: string, bundleId: string, appName: string): Promise<SmartUninstallResult> {
  return invoke('scan_app_leftovers', { appPath, bundleId, appName })
}

export async function runSmartUninstall(appPath: string, bundleId: string, appName: string, dryRun: boolean): Promise<UninstallActionResult> {
  return invoke('run_smart_uninstall', { appPath, bundleId, appName, dryRun })
}

export interface TreemapNode {
  name: string
  path: string
  size: number
  children: TreemapNode[]
}

export interface FileNode {
  name: string
  path: string
  size: number
  is_dir: boolean
  children: FileNode[]
}

export async function analyzeDiskTreemap(path: string, maxDepth: number): Promise<TreemapNode> {
  return invoke('analyze_disk_treemap', { path, maxDepth })
}

export async function getLargeFiles(path: string, minSizeMb: number): Promise<FileNode[]> {
  return invoke('get_large_files', { path, minSizeMb })
}

export async function getDirectorySummary(path: string): Promise<[string, number, number][]> {
  return invoke('get_directory_summary', { path })
}

// ─── Menu Bar Stats ──────────────────────────────────────────────────

export interface MenuBarStats {
  cpu_percent: number
  memory_used_gb: number
  memory_total_gb: number
  memory_percent: number
  network_down_mbps: number
  network_up_mbps: number
  top_process: string
  top_process_cpu: number
  battery_percent: number
  is_charging: boolean
}

export async function getMenuBarStats(): Promise<MenuBarStats> {
  return invoke('get_menu_bar_stats_cmd')
}

// ─── Project Artifact Purge ──────────────────────────────────────────

export interface ProjectArtifact {
  path: string
  artifact_type: string
  size: number
  file_count: number
}

export interface ProjectPurgeResult {
  artifacts: ProjectArtifact[]
  total_size: number
  total_count: number
  freed_size: number
  message: string
}

export interface ProjectPurgeRequest {
  paths: string[]
  dry_run: boolean
  artifact_types: string[]
}

export async function scanProjectArtifacts(
  paths: string[],
  types: string[]
): Promise<ProjectPurgeResult> {
  return invoke('scan_project_artifacts', { paths, types })
}

export async function purgeProjectArtifacts(
  request: ProjectPurgeRequest
): Promise<ProjectPurgeResult> {
  return invoke('purge_project_artifacts', { request })
}
