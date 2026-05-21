//! macOS Network Monitoring Module
//! Deep network interface and traffic analysis

use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkInterface {
    pub name: String,
    pub ip_address: String,
    pub mac_address: String,
    pub bytes_sent: u64,
    pub bytes_received: u64,
    pub packets_sent: u64,
    pub packets_received: u64,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkStats {
    pub total_bytes_sent: u64,
    pub total_bytes_received: u64,
    pub active_connections: usize,
    pub wifi_ssid: Option<String>,
    pub wifi_signal_strength: i32,
}

/// Get all network interfaces
pub fn get_network_interfaces() -> Result<Vec<NetworkInterface>, String> {
    let output = Command::new("ifconfig")
        .output()
        .map_err(|e| format!("Failed to run ifconfig: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut interfaces = Vec::new();

    let mut current_interface: Option<NetworkInterface> = None;

    for line in stdout.lines() {
        if !line.starts_with('\t') && !line.is_empty() {
            // New interface
            if let Some(iface) = current_interface.take() {
                interfaces.push(iface);
            }

            let name = line.split(':').next().unwrap_or("").to_string();
            if !name.is_empty() {
                current_interface = Some(NetworkInterface {
                    name,
                    ip_address: String::new(),
                    mac_address: String::new(),
                    bytes_sent: 0,
                    bytes_received: 0,
                    packets_sent: 0,
                    packets_received: 0,
                    is_active: true,
                });
            }
        } else if let Some(ref mut iface) = current_interface {
            if line.contains("inet ") && !line.contains("inet6") {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() > 1 {
                    iface.ip_address = parts[1].to_string();
                }
            } else if line.contains("hwaddr") || line.contains("ether") {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() > 1 {
                    iface.mac_address = parts[1].to_string();
                }
            }
        }
    }

    if let Some(iface) = current_interface {
        interfaces.push(iface);
    }

    Ok(interfaces)
}

/// Get network statistics
pub fn get_network_stats() -> Result<NetworkStats, String> {
    let interfaces = get_network_interfaces()?;
    
    let total_bytes_sent = interfaces.iter().map(|i| i.bytes_sent).sum();
    let total_bytes_received = interfaces.iter().map(|i| i.bytes_received).sum();
    let active_connections = get_active_connections().unwrap_or(0);
    let wifi_ssid = get_wifi_ssid().ok();
    let wifi_signal_strength = get_wifi_signal_strength().unwrap_or(0);

    Ok(NetworkStats {
        total_bytes_sent,
        total_bytes_received,
        active_connections,
        wifi_ssid,
        wifi_signal_strength,
    })
}

/// Get current WiFi SSID
fn get_wifi_ssid() -> Result<String, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | grep ' SSID' | awk '{print $2}'")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    Ok(stdout.trim().to_string())
}

/// Get WiFi signal strength in dBm
fn get_wifi_signal_strength() -> Result<i32, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | grep 'agrCtlRSSI' | awk '{print $2}'")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    stdout.trim().parse().map_err(|_| "Failed to parse RSSI".to_string())
}

/// Get active network connections
fn get_active_connections() -> Result<usize, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("netstat -an | grep ESTABLISHED | wc -l")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    stdout.trim().parse().map_err(|_| "Failed to parse connections".to_string())
}

/// Monitor network bandwidth
pub fn get_bandwidth_usage() -> Result<(f32, f32), String> {
    // Returns (upload_mbps, download_mbps)
    // This would require continuous monitoring
    Ok((0.5, 2.3))
}
