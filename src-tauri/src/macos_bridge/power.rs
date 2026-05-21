//! macOS Power Management Module
//! Deep integration with macOS power settings and battery management

use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerStatus {
    pub battery_percentage: f32,
    pub is_charging: bool,
    pub time_remaining_minutes: u32,
    pub power_source: PowerSource,
    pub low_power_mode: bool,
    pub charging_rate_watts: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum PowerSource {
    Battery,
    ACPower,
    UPSPower,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerProfile {
    pub name: String,
    pub cpu_speed_limit: u32,
    pub gpu_enabled: bool,
    pub display_sleep_timer: u32,
    pub disk_sleep_timer: u32,
}

/// Get current power status
pub fn get_power_status() -> Result<PowerStatus, String> {
    let output = Command::new("pmset")
        .args(&["-g", "batt"])
        .output()
        .map_err(|e| format!("Failed to get power status: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    
    let mut battery_percentage = 0.0f32;
    let mut is_charging = false;
    let mut time_remaining_minutes = 0u32;
    let mut power_source = PowerSource::Battery;

    for line in stdout.lines() {
        if line.contains("%") {
            // Parse battery percentage
            if let Some(pos) = line.find('%') {
                let start = line[..pos].rfind(char::is_whitespace).unwrap_or(0) + 1;
                battery_percentage = line[start..pos].parse().unwrap_or(0.0);
            }
        }

        if line.contains("charging") {
            is_charging = true;
            power_source = PowerSource::Battery;
        } else if line.contains("AC Power") || line.contains("AC attached") {
            power_source = PowerSource::ACPower;
        }

        if line.contains("remaining") {
            // Parse time remaining
            let parts: Vec<&str> = line.split_whitespace().collect();
            if let Some(time_str) = parts.iter().find(|s| s.contains(":")) {
                let time_parts: Vec<&str> = time_str.split(':').collect();
                if time_parts.len() >= 2 {
                    if let (Ok(h), Ok(m)) = (time_parts[0].parse::<u32>(), time_parts[1].parse::<u32>()) {
                        time_remaining_minutes = h * 60 + m;
                    }
                }
            }
        }
    }

    let low_power_mode = check_low_power_mode()?;
    let charging_rate_watts = estimate_charging_rate(battery_percentage, is_charging)?;

    Ok(PowerStatus {
        battery_percentage,
        is_charging,
        time_remaining_minutes,
        power_source,
        low_power_mode,
        charging_rate_watts,
    })
}

/// Get current power profile
pub fn get_power_profile() -> Result<PowerProfile, String> {
    let output = Command::new("pmset")
        .args(&["-g"])
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);

    let mut cpu_speed_limit = 100u32;
    let mut display_sleep_timer = 10u32;
    let mut disk_sleep_timer = 10u32;

    for line in stdout.lines() {
        if line.contains("displaysleep") {
            if let Some(val) = line.split_whitespace().last() {
                display_sleep_timer = val.parse().unwrap_or(10);
            }
        } else if line.contains("disksleep") {
            if let Some(val) = line.split_whitespace().last() {
                disk_sleep_timer = val.parse().unwrap_or(10);
            }
        }
    }

    Ok(PowerProfile {
        name: "Current".to_string(),
        cpu_speed_limit,
        gpu_enabled: true,
        display_sleep_timer,
        disk_sleep_timer,
    })
}

fn check_low_power_mode() -> Result<bool, String> {
    // Low Power Mode check for MacBooks
    let output = Command::new("sh")
        .arg("-c")
        .arg("pmset -g | grep 'PowerManagement'")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(!output.stdout.is_empty())
}

fn estimate_charging_rate(battery_percentage: f32, is_charging: bool) -> Result<f32, String> {
    if is_charging {
        // Typical MacBook charging rates
        // USB-C: 30W, 61W, 87W, 96W depending on model
        Ok(60.0) // Default estimate
    } else {
        Ok(0.0)
    }
}

/// Set display sleep timer (in minutes)
pub fn set_display_sleep(minutes: u32) -> Result<(), String> {
    Command::new("sh")
        .arg("-c")
        .arg(format!("pmset displaysleep {}", minutes))
        .output()
        .map_err(|e| format!("Failed to set display sleep: {}", e))?;
    Ok(())
}

/// Set disk sleep timer (in minutes)
pub fn set_disk_sleep(minutes: u32) -> Result<(), String> {
    Command::new("sh")
        .arg("-c")
        .arg(format!("pmset disksleep {}", minutes))
        .output()
        .map_err(|e| format!("Failed to set disk sleep: {}", e))?;
    Ok(())
}

/// Enable/disable automatic graphics switching
pub fn set_automatic_graphics_switching(enabled: bool) -> Result<(), String> {
    let state = if enabled { "on" } else { "off" };
    Command::new("sh")
        .arg("-c")
        .arg(format!("pmset autographicsswitching {}", state))
        .output()
        .map_err(|e| format!("Failed to set graphics switching: {}", e))?;
    Ok(())
}
