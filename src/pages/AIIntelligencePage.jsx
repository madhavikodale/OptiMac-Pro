import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { AlertCircle, TrendingUp, Zap, Shield, RefreshCw, CheckCircle, AlertTriangle } from 'react-icons/fa';

const AIIntelligencePage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const [analysisData, insightsData] = await Promise.all([
        invoke('analyze_system'),
        invoke('get_ai_insights')
      ]);
      setAnalysis(analysisData);
      setInsights(insightsData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-400' };
    if (health >= 60) return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400' };
    if (health >= 40) return { bg: 'from-orange-500 to-red-500', text: 'text-orange-400' };
    return { bg: 'from-red-500 to-red-600', text: 'text-red-400' };
  };

  const getHealthStatus = (health) => {
    if (health >= 80) return 'Excellent';
    if (health >= 60) return 'Good';
    if (health >= 40) return 'Fair';
    return 'Critical';
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertCircle className="text-red-500" size={20} />;
      case 'high': return <AlertTriangle className="text-orange-500" size={20} />;
      default: return <AlertTriangle className="text-yellow-500" size={20} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'high': return 'bg-orange-500/10 border-orange-500/30 text-orange-300';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-auto">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AI System Intelligence</h1>
            <p className="text-gray-400">Real-time analysis with AI-powered insights</p>
          </div>
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
            Error: {error}
          </div>
        )}

        {analysis && (
          <>
            {/* System Health Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Health Score */}
              <div className={`lg:col-span-1 bg-gradient-to-br ${getHealthColor(analysis.overall_health).bg} p-8 rounded-2xl shadow-2xl`}>
                <div className="text-center">
                  <Shield size={48} className="mx-auto mb-4 text-white/80" />
                  <div className={`text-6xl font-bold ${getHealthColor(analysis.overall_health).text} mb-2`}>
                    {Math.round(analysis.overall_health)}%
                  </div>
                  <div className="text-white font-semibold text-lg mb-4">
                    {getHealthStatus(analysis.overall_health)}
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${analysis.overall_health}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <StatCard 
                  label="Anomalies" 
                  value={analysis.anomalies?.length || 0}
                  icon={AlertCircle}
                  color="red"
                />
                <StatCard 
                  label="Suggestions" 
                  value={analysis.suggestions?.length || 0}
                  icon={Zap}
                  color="blue"
                />
                <StatCard 
                  label="AI Insights" 
                  value={insights.length}
                  icon={TrendingUp}
                  color="purple"
                />
                <StatCard 
                  label="Last Update" 
                  value={lastUpdate?.toLocaleTimeString() || 'N/A'}
                  icon={RefreshCw}
                  color="cyan"
                />
              </div>
            </div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="text-purple-400" />
                  AI Insights
                </h2>
                <div className="space-y-3">
                  {insights.map((insight, idx) => (
                    <div key={idx} className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{insight.title}</h3>
                          <p className="text-gray-300 text-sm mt-1">{insight.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-semibold text-purple-400">
                            {Math.round(insight.confidence)}% confidence
                          </div>
                          <span className="text-xs text-gray-400 uppercase block mt-1">
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
              <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-400" />
                  Detected Anomalies ({analysis.anomalies.length})
                </h2>
                <div className="space-y-3">
                  {analysis.anomalies.map((anomaly, idx) => (
                    <div key={idx} className={`border border-l-4 rounded-lg p-4 ${getSeverityColor(anomaly.severity)}`}>
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(anomaly.severity)}
                        <div className="flex-1">
                          <h3 className="font-semibold">{anomaly.metric}</h3>
                          <p className="text-sm mt-1 opacity-90">{anomaly.description}</p>
                          <div className="text-xs mt-2 opacity-75">
                            Current: {anomaly.value.toFixed(1)} | Expected: {anomaly.expected_range[0].toFixed(1)}-{anomaly.expected_range[1].toFixed(1)}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-white/10 rounded text-xs font-semibold uppercase whitespace-nowrap">
                          {anomaly.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-400" />
                  Optimization Suggestions
                </h2>
                <div className="space-y-3">
                  {analysis.suggestions
                    .sort((a, b) => b.priority - a.priority)
                    .map((suggestion, idx) => (
                    <div key={idx} className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{suggestion.title}</h3>
                          <p className="text-gray-300 text-sm mt-1">{suggestion.description}</p>
                          <div className="mt-2 flex gap-4 text-xs">
                            <span className="text-green-400">
                              Expected: +{suggestion.estimated_improvement.toFixed(1)}%
                            </span>
                            <span className="text-gray-400">
                              Impact: {suggestion.impact}
                            </span>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <div className="text-2xl font-bold text-green-400">
                            {suggestion.priority}/10
                          </div>
                          <span className="text-xs text-gray-400 block">Priority</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Trends */}
            {analysis.trends && (
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-blue-400" />
                  System Trends
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(analysis.trends).map(([metric, values]) => {
                    const latest = values[values.length - 1] || 0;
                    const previous = values[values.length - 2] || latest;
                    const trend = latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
                    
                    return (
                      <div key={metric} className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-gray-400 text-xs uppercase font-semibold mb-2">
                          {metric}
                        </h4>
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          {latest.toFixed(1)}%
                        </div>
                        <div className={`text-xs font-semibold ${
                          trend === 'up' ? 'text-red-400' : 
                          trend === 'down' ? 'text-green-400' : 
                          'text-gray-400'
                        }`}>
                          Trend: {trend}
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
            <Shield size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Click "Refresh" to analyze your system</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-lg p-4`}>
      <Icon size={24} className="text-white/60 mb-2" />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
};

export default AIIntelligencePage;
