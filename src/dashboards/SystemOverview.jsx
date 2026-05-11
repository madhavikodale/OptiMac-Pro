import { useState, useEffect } from 'react'
import { FiRefreshCw, FiTrendingUp, FiAlertTriangle, FiZap } from 'react-icons/fi'

export function SystemOverview({ systemStats, analysis, insights, onRefresh, loading }) {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">System Overview</h1>
          <p className="text-gray-400 mt-2">Real-time system metrics and AI insights</p>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition"
        >
          <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analyzing' : 'Refresh'}
        </button>
      </div>

      {/* HEALTH SCORE & PREDICTIONS */}
      <div className="grid grid-cols-4 gap-6">
        {/* System Health */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {analysis ? Math.round(analysis.overall_health) : '--'}%
          </div>
          <div className="text-green-400 font-semibold">System Health</div>
          <div className="w-full bg-green-500/20 rounded-full h-2 mt-4">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" 
              style={{ width: `${analysis?.overall_health || 0}%` }}
            />
          </div>
        </div>

        {/* CPU Prediction */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">CPU Trend</h3>
            <FiTrendingUp className="text-blue-400" size={20} />
          </div>
          {systemStats && (
            <>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {systemStats.cpu_usage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Current usage</div>
              <div className="mt-4 h-10 bg-blue-500/10 rounded flex items-center overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                  style={{ width: `${systemStats.cpu_usage}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Memory Pressure */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Memory</h3>
            <FiZap className="text-purple-400" size={20} />
          </div>
          {systemStats && (
            <>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {systemStats.memory_usage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">{(systemStats.memory_used / 1024 / 1024 / 1024).toFixed(1)} GB used</div>
              <div className="mt-4 h-10 bg-purple-500/10 rounded flex items-center overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  style={{ width: `${systemStats.memory_usage}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Disk Status */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Disk Space</h3>
            <FiAlertTriangle className="text-orange-400" size={20} />
          </div>
          {systemStats && (
            <>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {systemStats.disk_usage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">{(systemStats.disk_used / 1024 / 1024 / 1024).toFixed(1)} GB / {(systemStats.disk_total / 1024 / 1024 / 1024).toFixed(1)} GB</div>
              <div className="mt-4 h-10 bg-orange-500/10 rounded flex items-center overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500" 
                  style={{ width: `${systemStats.disk_usage}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-3 gap-6">
        {systemStats && (
          <>
            <MetricCard label="Battery" value={`${systemStats.battery_health.toFixed(0)}%`} unit="health" color="green" />
            <MetricCard label="Temperature" value={`${systemStats.temperature.toFixed(0)}°C`} unit="CPU" color="orange" />
            <MetricCard label="Network" value={`${(systemStats.network_down / 1024).toFixed(1)}`} unit="Mbps" color="blue" />
            <MetricCard label="Uptime" value={`${Math.floor(systemStats.uptime / 86400)}`} unit="days" color="purple" />
            <MetricCard label="Processes" value={systemStats.processes_count} unit="running" color="cyan" />
            <MetricCard label="Load Average" value={(systemStats.cpu_usage / 100).toFixed(2)} unit="normalized" color="pink" />
          </>
        )}
      </div>

      {/* AI INSIGHTS */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">AI Insights & Predictions</h2>
          <div className="grid grid-cols-2 gap-6">
            {insights.slice(0, 4).map((insight, idx) => (
              <div 
                key={idx} 
                className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-semibold flex-1">{insight.title}</h3>
                  <div className="text-xs font-bold px-3 py-1 rounded bg-purple-500/30 text-purple-200 ml-4">
                    {Math.round(insight.confidence)}%
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{insight.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{insight.category}</span>
                  <span className="text-purple-400 font-semibold">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANOMALIES & SUGGESTIONS */}
      {analysis && (
        <div className="grid grid-cols-2 gap-6">
          {/* Anomalies */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/20 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiAlertTriangle className="text-red-400" />
              Active Anomalies ({analysis.anomalies?.length || 0})
            </h2>
            <div className="space-y-4">
              {analysis.anomalies?.slice(0, 3).map((anomaly, idx) => (
                <div key={idx} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-white font-semibold text-sm">{anomaly.metric}</h4>
                  <p className="text-gray-300 text-xs mt-2">{anomaly.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                      anomaly.severity === 'critical' ? 'bg-red-500/40 text-red-200' :
                      anomaly.severity === 'high' ? 'bg-orange-500/40 text-orange-200' :
                      'bg-yellow-500/40 text-yellow-200'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No anomalies detected</p>}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiZap className="text-green-400" />
              Optimization Suggestions ({analysis.suggestions?.length || 0})
            </h2>
            <div className="space-y-4">
              {analysis.suggestions?.slice(0, 3).map((suggestion, idx) => (
                <div key={idx} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-white font-semibold text-sm">{suggestion.title}</h4>
                  <p className="text-gray-300 text-xs mt-2">{suggestion.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-green-400 font-semibold">+{suggestion.estimated_improvement.toFixed(1)}% improvement</span>
                    <span className="text-sm font-bold text-green-400">{suggestion.priority}/10</span>
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No suggestions available</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, unit, color }) {
  const colors = {
    green: 'from-green-500/20 border-green-500/30',
    orange: 'from-orange-500/20 border-orange-500/30',
    blue: 'from-blue-500/20 border-blue-500/30',
    purple: 'from-purple-500/20 border-purple-500/30',
    cyan: 'from-cyan-500/20 border-cyan-500/30',
    pink: 'from-pink-500/20 border-pink-500/30',
  }

  const textColors = {
    green: 'text-green-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    pink: 'text-pink-400',
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className={`text-3xl font-bold ${textColors[color]} mb-1`}>{value}</div>
      <div className="text-xs text-gray-500">{unit}</div>
    </div>
  )
}
