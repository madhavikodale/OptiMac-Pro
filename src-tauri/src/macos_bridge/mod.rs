//! macOS Deep System Integration Bridge
//! Provides native access to macOS system frameworks

pub mod system;
pub mod thermal;
pub mod network;
pub mod permissions;
pub mod power;

// Export only the functions we're currently using
pub use system::get_cpu_info;
pub use thermal::get_thermal_info;
pub use power::get_power_status;
