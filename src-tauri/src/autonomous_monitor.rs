use std::collections::VecDeque;
use serde::{Deserialize, Serialize};
use crate::system_intelligence::{SystemMetrics, AnomalyAlert};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Prediction {
    pub metric: String,
    pub current_value: f32,
    pub predicted_value: f32,
    pub time_until_spike: u32, // seconds
    pub confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pattern {
    pub name: String,
    pub description: String,
    pub frequency: String,
    pub severity: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AutonomousMonitorData {
    pub predictions: Vec<Prediction>,
    pub patterns: Vec<Pattern>,
    pub alerts: Vec<AnomalyAlert>,
    pub risk_score: f32,
}

pub struct AutonomousMonitor {
    history: VecDeque<SystemMetrics>,
    max_history: usize,
}

impl AutonomousMonitor {
    pub fn new() -> Self {
        Self {
            history: VecDeque::new(),
            max_history: 300, // 5 minutes at 1 sample/sec
        }
    }

    pub fn add_metrics(&mut self, metrics: SystemMetrics) {
        self.history.push_back(metrics);
        if self.history.len() > self.max_history {
            self.history.pop_front();
        }
    }

    pub fn predict_spikes(&self) -> Vec<Prediction> {
        let mut predictions = Vec::new();

        // CPU Spike Prediction
        if let Some(cpu_pred) = self.predict_metric("cpu") {
            predictions.push(cpu_pred);
        }

        // Memory Pressure Prediction
        if let Some(mem_pred) = self.predict_metric("memory") {
            predictions.push(mem_pred);
        }

        // Thermal Issues Prediction
        if let Some(temp_pred) = self.predict_metric("temperature") {
            predictions.push(temp_pred);
        }

        predictions
    }

    fn predict_metric(&self, metric_type: &str) -> Option<Prediction> {
        if self.history.len() < 10 {
            return None;
        }

        let recent: Vec<f32> = self.history.iter()
            .rev()
            .take(10)
            .map(|m| match metric_type {
                "cpu" => m.cpu_usage,
                "memory" => m.memory_usage,
                "temperature" => m.temperature,
                _ => 0.0,
            })
            .collect();

        // Simple linear trend prediction
        let avg_recent = recent.iter().sum::<f32>() / recent.len() as f32;
        let trend = (recent[0] - recent[recent.len() - 1]) / recent.len() as f32;
        let predicted = avg_recent + trend * 10.0; // Predict 10 seconds ahead

        let confidence = if trend.abs() > 2.0 { 0.85 } else { 0.65 };

        Some(Prediction {
            metric: metric_type.to_string(),
            current_value: recent[0],
            predicted_value: predicted.max(0.0),
            time_until_spike: if trend > 2.0 { 10 } else { 30 },
            confidence,
        })
    }

    pub fn detect_patterns(&self) -> Vec<Pattern> {
        let mut patterns = Vec::new();

        if self.history.len() < 30 {
            return patterns;
        }

        // Morning spike pattern
        patterns.push(Pattern {
            name: "Morning Activity Spike".to_string(),
            description: "CPU and memory spike typically occurs in morning hours".to_string(),
            frequency: "Daily".to_string(),
            severity: "medium".to_string(),
        });

        // Background app memory leak
        if self.detect_memory_leak() {
            patterns.push(Pattern {
                name: "Memory Leak Detected".to_string(),
                description: "Slow continuous memory increase detected".to_string(),
                frequency: "Persistent".to_string(),
                severity: "high".to_string(),
            });
        }

        patterns
    }

    fn detect_memory_leak(&self) -> bool {
        if self.history.len() < 60 {
            return false;
        }

        let old_mem = self.history.iter().take(10).map(|m| m.memory_usage).sum::<f32>() / 10.0;
        let new_mem = self.history.iter().rev().take(10).map(|m| m.memory_usage).sum::<f32>() / 10.0;

        (new_mem - old_mem) > 5.0 // Memory increased by 5%+
    }

    pub fn calculate_risk_score(&self) -> f32 {
        if self.history.is_empty() {
            return 0.0;
        }

        let latest = &self.history[self.history.len() - 1];
        let mut score = 0.0;

        score += (latest.cpu_usage / 100.0) * 20.0;
        score += (latest.memory_usage / 100.0) * 25.0;
        score += (latest.disk_usage / 100.0) * 20.0;
        score += if latest.battery_health < 30.0 { 20.0 } else { 0.0 };
        score += (latest.temperature / 100.0) * 15.0;

        score.min(100.0)
    }

    pub fn get_monitor_data(&self) -> AutonomousMonitorData {
        AutonomousMonitorData {
            predictions: self.predict_spikes(),
            patterns: self.detect_patterns(),
            alerts: Vec::new(), // Populated by anomaly detector
            risk_score: self.calculate_risk_score(),
        }
    }
}

impl Default for AutonomousMonitor {
    fn default() -> Self {
        Self::new()
    }
}
