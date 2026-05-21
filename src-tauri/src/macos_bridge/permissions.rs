//! macOS Permissions and Authorization Module
//! Handle app permissions and system access controls

use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum PermissionStatus {
    Granted,
    Denied,
    NotDetermined,
    Restricted,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppPermissions {
    pub camera: PermissionStatus,
    pub microphone: PermissionStatus,
    pub calendar: PermissionStatus,
    pub contacts: PermissionStatus,
    pub reminders: PermissionStatus,
    pub photos: PermissionStatus,
    pub screen_recording: PermissionStatus,
    pub accessibility: PermissionStatus,
    pub full_disk_access: PermissionStatus,
}

/// Check if app has full disk access (required for deep monitoring)
pub fn has_full_disk_access() -> Result<bool, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("test -r /private/var/db/sudo && echo 'yes' || echo 'no'")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    Ok(stdout.contains("yes"))
}

/// Check if app has accessibility permissions
pub fn has_accessibility_access() -> Result<bool, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("launchctl list | grep -q 'com.apple.accessibility.api' && echo 'yes' || echo 'no'")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    Ok(stdout.contains("yes"))
}

/// Get app permission status
pub fn get_app_permissions() -> Result<AppPermissions, String> {
    let accessibility = has_accessibility_access()
        .map(|b| if b { PermissionStatus::Granted } else { PermissionStatus::Denied })
        .unwrap_or(PermissionStatus::NotDetermined);

    let full_disk_access = has_full_disk_access()
        .map(|b| if b { PermissionStatus::Granted } else { PermissionStatus::Denied })
        .unwrap_or(PermissionStatus::NotDetermined);

    Ok(AppPermissions {
        camera: PermissionStatus::NotDetermined,
        microphone: PermissionStatus::NotDetermined,
        calendar: PermissionStatus::NotDetermined,
        contacts: PermissionStatus::NotDetermined,
        reminders: PermissionStatus::NotDetermined,
        photos: PermissionStatus::NotDetermined,
        screen_recording: PermissionStatus::NotDetermined,
        accessibility,
        full_disk_access,
    })
}

/// Request accessibility permissions
pub fn request_accessibility_access() -> Result<(), String> {
    Command::new("sh")
        .arg("-c")
        .arg("open 'x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility'")
        .output()
        .map_err(|e| format!("Failed to open preferences: {}", e))?;
    Ok(())
}

/// Request full disk access
pub fn request_full_disk_access() -> Result<(), String> {
    Command::new("sh")
        .arg("-c")
        .arg("open 'x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles'")
        .output()
        .map_err(|e| format!("Failed to open preferences: {}", e))?;
    Ok(())
}

/// Check if running with elevated privileges
pub fn is_elevated() -> Result<bool, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("id -u")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let uid: u32 = stdout.trim().parse().unwrap_or(501);
    Ok(uid == 0)
}

/// Check system integrity protection (SIP) status
pub fn is_system_integrity_protection_enabled() -> Result<bool, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("csrutil status 2>/dev/null | grep -q 'enabled' && echo 'yes' || echo 'no'")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    Ok(stdout.contains("yes"))
}

/// Get code signing requirements
pub fn verify_code_signing(app_path: &str) -> Result<bool, String> {
    let output = Command::new("codesign")
        .args(&["-v", app_path])
        .output()
        .map_err(|e| e.to_string())?;

    Ok(output.status.success())
}
