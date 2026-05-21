# ⚡ OptiMac Pro - Quick Start Commands

## 🚀 Development Setup

### Build & Compile
```bash
# Development build
cd src-tauri
cargo build

# Release build (optimized)
cargo build --release

# Check compilation without building
cargo check

# Run clippy (Rust linter)
cargo clippy --all-features
```

### Testing
```bash
# Run all tests
cargo test

# Run tests with output
cargo test -- --nocapture

# Test specific module
cargo test macos_bridge::
```

## 🧪 Running the App

### Development Mode
```bash
# From project root
npm run tauri dev

# With logging
RUST_LOG=debug npm run tauri dev
```

### Production Build
```bash
# Create release bundle
npm run tauri build

# Release will be in: src-tauri/target/release/bundle/
```

## 📊 Accessing New Features

### From React Frontend
```typescript
import { invoke } from '@tauri-apps/api/tauri';

// System Information
const systemInfo = await invoke('get_macos_system_info');
console.log(systemInfo);
// Output: "CPU: Apple M1 (8x cores)..."

// Thermal Status
const thermal = await invoke('get_thermal_status');
console.log(thermal);
// Output: "CPU Temp: 45.2°C, GPU Temp: 42.1°C..."

// Power Status
const power = await invoke('get_power_info');
console.log(power);
// Output: "Battery: 72.0%, Charging: true..."
```

## 📝 File Locations

### Source Code### Documentation## 🔍 Verify Installation

```bash
# Check Rust version
rustc --version

# Check Cargo version
cargo --version

# Verify Node/npm
node --version
npm --version

# List all Tauri commands
cargo tauri --version

# Check build status
cd src-tauri && cargo check --all-features
```

## 🛠️ Common Development Tasks

### Adding a New System Monitoring Feature

1. **Create new file** in `src/macos_bridge/`:
```bash
touch src-tauri/src/macos_bridge/new_feature.rs
```

2. **Add to mod.rs**:
```rust
pub mod new_feature;
pub use new_feature::*;
```

3. **Implement functions**:
```rust
pub fn get_feature_data() -> Result<FeatureData, String> {
    // Implementation
}
```

4. **Add Tauri command** in `main.rs`:
```rust
#[tauri::command]
fn get_feature_data_command() -> Result<String, String> {
    // Call your function
}
```

5. **Update handler** in main():
```rust
.invoke_handler(tauri::generate_handler![
    // ... existing commands
    get_feature_data_command,  // Add new
])
```

### Debugging

```bash
# Enable verbose logging
RUST_LOG=debug cargo tauri dev

# Filter logs by module
RUST_LOG=app::macos_bridge=debug cargo tauri dev

# Check for compilation issues
cargo check --all-features 2>&1 | grep -E "error|warning"
```

## 📦 Dependency Management

### Update Dependencies
```bash
cd src-tauri
cargo update
```

### Add New Dependency
```bash
cd src-tauri
cargo add package_name

# Example: cargo add serde_json
```

### Check Dependencies
```bash
cargo tree
cargo tree --depth=1
```

## 🚀 Performance Testing

```bash
# Benchmark build time
time cargo build --release

# Check binary size
ls -lh src-tauri/target/release/bundle/macos/OptiMacPro.app/Contents/MacOS/app

# Profile CPU usage
cargo build --release --timings
```

## 🔒 Code Signing & Notarization (Phase 3)

```bash
# Sign the app
codesign -s - /path/to/OptiMacPro.app

# Verify signature
codesign -v /path/to/OptiMacPro.app

# Check entitlements
codesign -d --entitlements :- /path/to/OptiMacPro.app
```

## 📋 Environment Setup

### macOS Preferences
```bash
# Allow Full Disk Access (Terminal app)
# System Preferences > Security & Privacy > Full Disk Access

# Allow Accessibility (OptiMac Pro app)
# System Preferences > Security & Privacy > Accessibility

# Check System Integrity Protection
csrutil status
```

## 🆘 Troubleshooting

### Clean Build
```bash
cd src-tauri
cargo clean
cargo build
```

### Reset Node Modules
```bash
rm -rf node_modules
npm install
```

### Fix Permission Issues
```bash
# Make build script executable
chmod +x build.sh

# Reset Xcode paths
sudo xcode-select --reset
```

### Check Tauri Health
```bash
tauri info
```

## 📚 Additional Resources

- **Tauri Docs**: https://tauri.app/en/docs/
- **Rust Book**: https://doc.rust-lang.org/book/
- **macOS APIs**: https://developer.apple.com/documentation/
- **Sysinfo Crate**: https://docs.rs/sysinfo/latest/sysinfo/

## 🎯 Next Phase Commands (When Ready)

```bash
# Phase 2: Start advanced features
npm run phase-2-setup

# Phase 3: Prepare for distribution
npm run phase-3-setup

# Create installer
npm run build:installer
```

---

**Last Updated**: May 13, 2026  
**Status**: Phase 1 Complete ✅  
**Ready for**: Phase 2 Development

