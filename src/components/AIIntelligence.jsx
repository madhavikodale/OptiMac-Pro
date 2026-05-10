import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { AlertCircle, TrendingUp, Zap, Shield } from 'react-icons/fa';

const AIIntelligence = () => {
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemAnalysis();
    const interval = setInterval(fetchSystemAnalysis, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemAnalysis = async () => {
    try {
      setLoading(true);
      const analysisData = await invoke('analyze_system');
      const insightsData = await invoke('get_ai_insights');
      
      setAnalysis(analysisData);
      setInsights(insightsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching AI analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-green-500';
    if (health >= 60) return 'text-yellow-500';
    if (health >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI System Intelligence</h2>
        <button
          onClick={fetchSystemAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Now'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
          Error: {error}
        </div>
      )}

      {analysis && (
        <>
          {/* System Health Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  System Health
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Overall system performance and stability</p>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getHealthColor(analysis.overall_health)}`}>
                  {Math.round(analysis.overall_health)}%
                </div>
                <Shield className="ml-auto mt-2 text-gray-400" size={32} />
              </div>
            </div>
            
            {/* Health Bar */}
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  analysis.overall_health >= 80
                    ? 'bg-green-500'
                    : analysis.overall_health >= 60
                    ? 'bg-yellow-500'
                    : analysis.overall_health >= 40
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${analysis.overall_health}%` }}
              />
            </div>
          </div>

          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="mr-2 text-yellow-500" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {insight.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {insight.description}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {Math.round(insight.confidence)}% confidence
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1 block">
                          {insight.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomalies */}
          {analysis.anomalies && analysis.anomalies.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="mr-2 text-red-500" />
                Detected Anomalies ({analysis.anomalies.length})
              </h3>
              <div className="space-y-3">
                {analysis.anomalies.map((anomaly, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-l-4 rounded ${getSeverityColor(anomaly.severity)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {anomaly.metric}
                        </h4>
                        <p className="text-sm mt-1">
                          {anomaly.description}
                        </p>
                        <div className="text-xs mt-2 opacity-70">
                          Current: {anomaly.value.toFixed(1)} | Expected: {anomaly.expected_range[0].toFixed(1)} - {anomaly.expected_range[1].toFixed(1)}
                        </div>
                      </div>
                      <span className="ml-4 px-3 py-1 bg-white bg-opacity-30 rounded text-xs font-semibold uppercase">
                        {anomaly.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-500" />
                Optimization Suggestions
              </h3>
              <div className="space-y-3">
                {analysis.suggestions
                  .sort((a, b) => b.priority - a.priority)
                  .map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-green-50 dark:bg-green-900 border-l-4 border-green-500 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {suggestion.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {suggestion.description}
                        </p>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          Expected improvement: +{suggestion.estimated_improvement.toFixed(1)}%
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Priority: {suggestion.priority}/10
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1 block">
                          {suggestion.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends */}
          {analysis.trends && Object.keys(analysis.trends).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Trends
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(analysis.trends).map(([metric, values]) => {
                  const latest = values[values.length - 1] || 0;
                  const previous = values[values.length - 2] || latest;
                  const trend = latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
                  
                  return (
                    <div key={metric} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                        {metric}
                      </h4>
                      <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {latest.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Trend: <span className={trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'}>
                          {trend}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {!analysis && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Click "Analyze Now" to get AI-powered system insights
          </p>
        </div>
      )}
    </div>
  );
};

export default AIIntelligence;
