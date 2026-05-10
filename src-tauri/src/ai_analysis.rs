use serde::{Deserialize, Serialize};
use crate::system_intelligence::{SystemMetrics, SystemAnalysis, AnomalyAlert, OptimizationSuggestion};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIInsight {
    pub title: String,
    pub description: String,
    pub confidence: f32, // 0-100
    pub category: String,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformancePrediction {
    pub metric: String,
    pub predicted_value: f32,
    pub time_horizon: String, // "5min", "1hour", "1day"
    pub confidence: f32,
}

pub struct AIAnalyzer {
    learning_rate: f32,
    confidence_threshold: f32,
}

impl AIAnalyzer {
    pub fn new() -> Self {
        AIAnalyzer {
            learning_rate: 0.1,
            confidence_threshold: 70.0,
        }
    }

    pub fn generate_insights(&self, analysis: &SystemAnalysis) -> Vec<AIInsight> {
        let mut insights = Vec::new();

        // Health-based insights
        if analysis.overall_health < 30.0 {
            insights.push(AIInsight {
                title: "Critical System Health".to_string(),
                description: "Your system is running with critical issues. Immediate action recommended.".to_string(),
                confidence: 95.0,
                category: "health".to_string(),
                timestamp: Utc::now(),
            });
        } else if analysis.overall_health < 60.0 {
            insights.push(AIInsight {
                title: "Degraded Performance".to_string(),
                description: "System performance is below optimal levels. Consider applying suggestions.".to_string(),
                confidence: 85.0,
                category: "health".to_string(),
                timestamp: Utc::now(),
            });
        }

        // Anomaly-based insights
        if analysis.anomalies.len() > 3 {
            insights.push(AIInsight {
                title: "Multiple Issues Detected".to_string(),
                description: format!(
                    "Found {} active anomalies. Review and address them systematically.",
                    analysis.anomalies.len()
                ),
                confidence: 90.0,
                category: "anomaly".to_string(),
                timestamp: Utc::now(),
            });
        }

        // Critical anomalies
        let critical_count = analysis
            .anomalies
            .iter()
            .filter(|a| a.severity == "critical")
            .count();

        if critical_count > 0 {
            insights.push(AIInsight {
                title: "Critical Alert".to_string(),
                description: format!(
                    "{} critical issue(s) requiring immediate attention.",
                    critical_count
                ),
                confidence: 98.0,
                category: "critical".to_string(),
                timestamp: Utc::now(),
            });
        }

        insights
    }

    pub fn predict_performance(
        &self,
        metrics: &SystemMetrics,
        historical_data: &[SystemMetrics],
    ) -> Vec<PerformancePrediction> {
        let mut predictions = Vec::new();

        // Predict CPU usage
        if historical_data.len() > 5 {
            let avg_cpu: f32 = historical_data.iter().map(|m| m.cpu_usage).sum::<f32>()
                / historical_data.len() as f32;
            let trend = if metrics.cpu_usage > avg_cpu { 1.1 } else { 0.9 };

            predictions.push(PerformancePrediction {
                metric: "cpu_usage".to_string(),
                predicted_value: (metrics.cpu_usage * trend).min(100.0),
                time_horizon: "5min".to_string(),
                confidence: 75.0,
            });
        }

        // Predict Memory usage
        if historical_data.len() > 5 {
            let avg_memory: f32 = historical_data.iter().map(|m| m.memory_usage).sum::<f32>()
                / historical_data.len() as f32;
            let trend = if metrics.memory_usage > avg_memory {
                1.05
            } else {
                0.95
            };

            predictions.push(PerformancePrediction {
                metric: "memory_usage".to_string(),
                predicted_value: (metrics.memory_usage * trend).min(100.0),
                time_horizon: "5min".to_string(),
                confidence: 72.0,
            });
        }

        predictions
    }

    pub fn prioritize_suggestions(
        &self,
        suggestions: &[OptimizationSuggestion],
    ) -> Vec<OptimizationSuggestion> {
        let mut sorted = suggestions.to_vec();
        sorted.sort_by(|a, b| b.priority.cmp(&a.priority));
        sorted
    }

    pub fn assess_anomaly_severity(&self, anomaly: &AnomalyAlert) -> f32 {
        match anomaly.severity.as_str() {
            "critical" => 100.0,
            "high" => 75.0,
            "medium" => 50.0,
            "low" => 25.0,
            _ => 0.0,
        }
    }

    pub fn calculate_recommendation_confidence(&self, insight: &AIInsight) -> bool {
        insight.confidence >= self.confidence_threshold
    }

    pub fn batch_analyze(
        &self,
        analyses: &[SystemAnalysis],
    ) -> (f32, Vec<String>) {
        let mut aggregated_health = 0.0;
        let mut common_issues = Vec::new();

        if analyses.is_empty() {
            return (0.0, common_issues);
        }

        // Calculate average health
        aggregated_health =
            analyses.iter().map(|a| a.overall_health).sum::<f32>() / analyses.len() as f32;

        // Find common anomalies
        let mut anomaly_counts: std::collections::HashMap<String, usize> =
            std::collections::HashMap::new();

        for analysis in analyses {
            for anomaly in &analysis.anomalies {
                *anomaly_counts.entry(anomaly.metric.clone()).or_insert(0) += 1;
            }
        }

        // Return issues that appear in at least 50% of analyses
        let threshold = analyses.len() / 2;
        for (issue, count) in anomaly_counts {
            if count >= threshold {
                common_issues.push(issue);
            }
        }

        (aggregated_health, common_issues)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_ai_analyzer_creation() {
        let analyzer = AIAnalyzer::new();
        assert!(analyzer.confidence_threshold > 0.0);
    }

    #[test]
    fn test_severity_assessment() {
        let analyzer = AIAnalyzer::new();
        let anomaly = AnomalyAlert {
            metric: "CPU".to_string(),
            severity: "critical".to_string(),
            value: 95.0,
            expected_range: (0.0, 70.0),
            description: "High CPU".to_string(),
            timestamp: Utc::now(),
        };

        let severity = analyzer.assess_anomaly_severity(&anomaly);
        assert_eq!(severity, 100.0);
    }
}
