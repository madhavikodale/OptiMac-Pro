use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub cpu_usage: f32,
    pub memory_usage: f32,
    pub disk_usage: f32,
    pub temperature: f32,
    pub battery_health: f32,
    pub network_up: f32,
    pub network_down: f32,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnomalyAlert {
    pub metric: String,
    pub severity: String, // "low", "medium", "high", "critical"
    pub value: f32,
    pub expected_range: (f32, f32),
    pub description: String,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptimizationSuggestion {
    pub title: String,
    pub description: String,
    pub impact: String, // "performance", "memory", "battery", "disk"
    pub priority: i32,  // 1-10
    pub estimated_improvement: f32, // percentage
    pub commands: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemAnalysis {
    pub overall_health: f32, // 0-100
    pub anomalies: Vec<AnomalyAlert>,
    pub suggestions: Vec<OptimizationSuggestion>,
    pub trends: HashMap<String, Vec<f32>>,
}

pub struct SystemIntelligence {
    metrics_history: Vec<SystemMetrics>,
    baseline_metrics: Option<SystemMetrics>,
}

impl SystemIntelligence {
    pub fn new() -> Self {
        SystemIntelligence {
            metrics_history: Vec::new(),
            baseline_metrics: None,
        }
    }

    pub fn record_metrics(&mut self, metrics: SystemMetrics) {
        // Initialize baseline on first record
        if self.baseline_metrics.is_none() {
            self.baseline_metrics = Some(metrics.clone());
        }
        self.metrics_history.push(metrics);
        
        // Keep only last 1000 records
        if self.metrics_history.len() > 1000 {
            self.metrics_history.remove(0);
        }
    }

    pub fn detect_anomalies(&self, metrics: &SystemMetrics) -> Vec<AnomalyAlert> {
        let mut anomalies = Vec::new();

        // CPU anomaly detection
        if metrics.cpu_usage > 85.0 {
            anomalies.push(AnomalyAlert {
                metric: "CPU Usage".to_string(),
                severity: if metrics.cpu_usage > 95.0 {
                    "critical".to_string()
                } else {
                    "high".to_string()
                },
                value: metrics.cpu_usage,
                expected_range: (0.0, 70.0),
                description: format!(
                    "CPU usage is {}%. Consider checking running processes.",
                    metrics.cpu_usage as i32
                ),
                timestamp: metrics.timestamp,
            });
        }

        // Memory anomaly detection
        if metrics.memory_usage > 85.0 {
            anomalies.push(AnomalyAlert {
                metric: "Memory Usage".to_string(),
                severity: if metrics.memory_usage > 95.0 {
                    "critical".to_string()
                } else {
                    "high".to_string()
                },
                value: metrics.memory_usage,
                expected_range: (0.0, 75.0),
                description: format!(
                    "Memory usage is {}%. Consider clearing cache or restarting apps.",
                    metrics.memory_usage as i32
                ),
                timestamp: metrics.timestamp,
            });
        }

        // Disk anomaly detection
        if metrics.disk_usage > 90.0 {
            anomalies.push(AnomalyAlert {
                metric: "Disk Usage".to_string(),
                severity: "high".to_string(),
                value: metrics.disk_usage,
                expected_range: (0.0, 80.0),
                description: format!(
                    "Disk is {}% full. Consider removing old files or applications.",
                    metrics.disk_usage as i32
                ),
                timestamp: metrics.timestamp,
            });
        }

        // Temperature anomaly detection
        if metrics.temperature > 85.0 {
            anomalies.push(AnomalyAlert {
                metric: "Temperature".to_string(),
                severity: if metrics.temperature > 95.0 {
                    "critical".to_string()
                } else {
                    "high".to_string()
                },
                value: metrics.temperature,
                expected_range: (20.0, 75.0),
                description: format!(
                    "System temperature is {}°C. Ensure proper ventilation.",
                    metrics.temperature as i32
                ),
                timestamp: metrics.timestamp,
            });
        }

        // Battery health anomaly
        if metrics.battery_health < 30.0 {
            anomalies.push(AnomalyAlert {
                metric: "Battery Health".to_string(),
                severity: if metrics.battery_health < 20.0 {
                    "high".to_string()
                } else {
                    "medium".to_string()
                },
                value: metrics.battery_health,
                expected_range: (50.0, 100.0),
                description: format!(
                    "Battery health is at {}%. Consider battery replacement soon.",
                    metrics.battery_health as i32
                ),
                timestamp: metrics.timestamp,
            });
        }

        anomalies
    }

    pub fn generate_suggestions(&self, metrics: &SystemMetrics) -> Vec<OptimizationSuggestion> {
        let mut suggestions = Vec::new();

        // High CPU suggestion
        if metrics.cpu_usage > 75.0 {
            suggestions.push(OptimizationSuggestion {
                title: "Reduce CPU Load".to_string(),
                description: "Close unnecessary applications and browser tabs to free up CPU resources.".to_string(),
                impact: "performance".to_string(),
                priority: 8,
                estimated_improvement: 15.0,
                commands: vec![
                    "killall Spotify".to_string(),
                    "killall Slack".to_string(),
                ],
            });
        }

        // High Memory suggestion
        if metrics.memory_usage > 80.0 {
            suggestions.push(OptimizationSuggestion {
                title: "Clear Memory Cache".to_string(),
                description: "Empty system caches to reclaim used memory.".to_string(),
                impact: "memory".to_string(),
                priority: 7,
                estimated_improvement: 20.0,
                commands: vec![
                    "sudo purge".to_string(),
                ],
            });
        }

        // High Disk usage suggestion
        if metrics.disk_usage > 85.0 {
            suggestions.push(OptimizationSuggestion {
                title: "Free Up Disk Space".to_string(),
                description: "Remove old log files, caches, and unused applications.".to_string(),
                impact: "disk".to_string(),
                priority: 9,
                estimated_improvement: 25.0,
                commands: vec![
                    "rm -rf ~/Library/Logs/*".to_string(),
                    "rm -rf ~/Library/Caches/*".to_string(),
                ],
            });
        }

        // Low battery suggestion
        if metrics.battery_health < 50.0 {
            suggestions.push(OptimizationSuggestion {
                title: "Extend Battery Life".to_string(),
                description: "Enable low power mode and reduce screen brightness.".to_string(),
                impact: "battery".to_string(),
                priority: 6,
                estimated_improvement: 30.0,
                commands: vec![
                    "pmset -b sleep 5".to_string(),
                ],
            });
        }

        suggestions
    }

    pub fn calculate_system_health(&self, metrics: &SystemMetrics) -> f32 {
        let mut health = 100.0;

        // Deduct points based on metrics
        health -= (metrics.cpu_usage / 100.0) * 20.0;
        health -= (metrics.memory_usage / 100.0) * 25.0;
        health -= (metrics.disk_usage / 100.0) * 20.0;
        health -= ((100.0 - metrics.battery_health) / 100.0) * 15.0;
        health -= (metrics.temperature / 120.0) * 20.0;

        health.max(0.0).min(100.0)
    }

    pub fn analyze(&mut self, metrics: SystemMetrics) -> SystemAnalysis {
        self.record_metrics(metrics.clone());

        let anomalies = self.detect_anomalies(&metrics);
        let suggestions = self.generate_suggestions(&metrics);
        let overall_health = self.calculate_system_health(&metrics);

        // Calculate trends
        let mut trends = HashMap::new();
        if self.metrics_history.len() > 0 {
            let cpu_trend: Vec<f32> = self
                .metrics_history
                .iter()
                .map(|m| m.cpu_usage)
                .collect();
            let memory_trend: Vec<f32> = self
                .metrics_history
                .iter()
                .map(|m| m.memory_usage)
                .collect();
            let disk_trend: Vec<f32> = self
                .metrics_history
                .iter()
                .map(|m| m.disk_usage)
                .collect();

            trends.insert("cpu".to_string(), cpu_trend);
            trends.insert("memory".to_string(), memory_trend);
            trends.insert("disk".to_string(), disk_trend);
        }

        SystemAnalysis {
            overall_health,
            anomalies,
            suggestions,
            trends,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_anomaly_detection() {
        let mut intelligence = SystemIntelligence::new();
        let metrics = SystemMetrics {
            cpu_usage: 95.0,
            memory_usage: 50.0,
            disk_usage: 50.0,
            temperature: 50.0,
            battery_health: 80.0,
            network_up: 1.0,
            network_down: 1.0,
            timestamp: Utc::now(),
        };

        let anomalies = intelligence.detect_anomalies(&metrics);
        assert!(anomalies.len() > 0);
    }
}
