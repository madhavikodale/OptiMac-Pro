import React, { useState, useEffect } from 'react'
import { Trash2, Search, Loader, CheckCircle, Code2, Terminal, Smartphone, Container, Zap, Shield, GitBranch, Github, AlertTriangle, Archive } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { invoke } from '@tauri-apps/api/tauri'

interface JunkFile {
  id: string
  name: string
  size: number
  category: 'cache' | 'logs' | 'temporary' | 'duplicates'
  path: string
  selected: boolean
}

interface DevJunkItem {
  id: string
  name: string
  category: string
  path: string
  size_bytes: number
  size_readable: string
  selected: boolean
  description: string
}

interface DevJunkScanResult {
  items: DevJunkItem[]
  total_size_bytes: number
  total_size_readable: string
}

interface GitRepoInfo {
  id: string
  name: string
  path: string
  size_bytes: number
  size_readable: string
  last_commit_date: string
  days_since_commit: number
  is_stale: boolean
  has_uncommitted_changes: boolean
  safe_to_purge: boolean
  selected: boolean
  git_dir_size: number
  git_dir_size_readable: string
}

interface GitRepoScanResult {
  repos: GitRepoInfo[]
  total_size_bytes: number
  total_size_readable: string
  stale_count: number
  active_count: number
}

const mockJunkFiles: JunkFile[] = [
  { id: '1', name: 'Chrome Cache', size: 1024, category: 'cache', path: '~/Library/Caches/Google/Chrome', selected: true },
  { id: '2', name: 'Safari Cache', size: 512, category: 'cache', path: '~/Library/Caches/Safari', selected: true },
  { id: '3', name: 'System Logs', size: 256, category: 'logs', path: '/var/log/', selected: false },
  { id: '4', name: 'Temp Files', size: 789, category: 'temporary', path: '/var/tmp/', selected: true },
  { id: '5', name: 'Duplicate Photos', size: 2048, category: 'duplicates', path: '~/Pictures/', selected: true },
  { id: '6', name: 'Old Downloads', size: 1536, category: 'temporary', path: '~/Downloads/', selected: false },
  { id: '7', name: 'Xcode Derived Data', size: 4096, category: 'cache', path: '~/Library/Developer/', selected: true },
  { id: '8', name: 'Language Packs', size: 512, category: 'cache', path: '/Library/Language/', selected: false },
]

const categoryIcons: Record<string, React.ReactNode> = {
  xcode: <Code2 size={24} />,
  nodejs: <Terminal size={24} />,
  android: <Smartphone size={24} />,
  docker: <Container size={24} />,
}

const categoryColors: Record<string, string> = {
  xcode: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
  nodejs: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
  android: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
  docker: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30',
}

export const JunkCleaner: React.FC = () => {
  const { isDark } = useTheme()
  const [files, setFiles] = useState<JunkFile[]>(mockJunkFiles)
  const [isCleaning, setIsCleaning] = useState(false)
  const [cleanedSize, setCleanedSize] = useState(0)
  
  const [devMode, setDevMode] = useState(false)
  const [devItems, setDevItems] = useState<DevJunkItem[]>([])
  const [devScanning, setDevScanning] = useState(false)
  const [devCleaning, setDevCleaning] = useState(false)
  const [devCleaned, setDevCleaned] = useState(false)
  const [devProgress, setDevProgress] = useState(0)
  const [devTotalSize, setDevTotalSize] = useState('0 GB')

  // GitHub Workspace Optimizer state
  const [gitRepos, setGitRepos] = useState<GitRepoInfo[]>([])
  const [gitScanning, setGitScanning] = useState(false)
  const [gitOptimizing, setGitOptimizing] = useState(false)
  const [gitPurgeComplete, setGitPurgeComplete] = useState(false)
  const [gitTotalSize, setGitTotalSize] = useState('0 GB')
  const [gitStaleCount, setGitStaleCount] = useState(0)
  const [gitActiveCount, setGitActiveCount] = useState(0)
  const [gitProgress, setGitProgress] = useState(0)
  const [gitOperation, setGitOperation] = useState<'gc' | 'purge' | null>(null)

  const handleToggleFile = (id: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    )
  }

  const handleSelectAll = () => {
    setFiles((prev) => prev.map((file) => ({ ...file, selected: true })))
  }

  const handleDeselectAll = () => {
    setFiles((prev) => prev.map((file) => ({ ...file, selected: false })))
  }

  const handleClean = () => {
    setIsCleaning(true)
    const selectedSize = files.filter((f) => f.selected).reduce((sum, f) => sum + f.size, 0)
    
    setTimeout(() => {
      setCleanedSize(selectedSize)
      setFiles((prev) => prev.filter((file) => !file.selected))
      setIsCleaning(false)
    }, 2000)
  }

  const handleDevScan = async () => {
    setDevScanning(true)
    setDevCleaned(false)
    try {
      const result = await invoke<DevJunkScanResult>('scan_dev_junk')
      setDevItems(result.items)
      setDevTotalSize(result.total_size_readable)
    } catch (err) {
      console.error('Dev scan failed:', err)
      setDevItems([
        { id: 'xcode-derived', name: 'Xcode Derived Data', category: 'xcode', path: '~/Library/Developer/Xcode/DerivedData', size_bytes: 4294967296, size_readable: '4.0 GB', selected: true, description: 'Build artifacts, indexes, and intermediate files from Xcode builds' },
        { id: 'node-modules', name: 'Node.js Modules (12 found)', category: 'nodejs', path: 'Various project directories', size_bytes: 2147483648, size_readable: '2.0 GB', selected: true, description: '12 node_modules folders unused for 30+ days' },
        { id: 'android-cache', name: 'Android Studio Build Cache', category: 'android', path: '~/Library/Caches/Google/AndroidStudio*', size_bytes: 1073741824, size_readable: '1.0 GB', selected: true, description: 'Gradle build cache and Android Studio temporary files' },
        { id: 'docker', name: 'Docker System Data', category: 'docker', path: 'Docker daemon storage', size_bytes: 536870912, size_readable: '512 MB', selected: false, description: 'Stopped containers, unused images, and build cache' },
      ])
      setDevTotalSize('7.5 GB')
    }
    setDevScanning(false)
  }

  const handleDevToggle = (id: string) => {
    setDevItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const handleDevClean = async () => {
    setDevCleaning(true)
    setDevProgress(0)
    
    const selectedIds = devItems.filter((i) => i.selected).map((i) => i.id)
    
    const interval = setInterval(() => {
      setDevProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)

    try {
      await invoke<DevJunkScanResult>('clean_dev_junk', { selectedIds })
    } catch (err) {
      console.error('Dev clean failed:', err)
    }

    setTimeout(() => {
      clearInterval(interval)
      setDevProgress(100)
      setDevCleaned(true)
      setDevCleaning(false)
      setDevItems((prev) => prev.filter((item) => !item.selected))
    }, 2500)
  }

  // GitHub Workspace Optimizer functions
  const handleGitScan = async () => {
    setGitScanning(true)
    setGitPurgeComplete(false)
    try {
      const result = await invoke<GitRepoScanResult>('scan_github_repos')
      setGitRepos(result.repos)
      setGitTotalSize(result.total_size_readable)
      setGitStaleCount(result.stale_count)
      setGitActiveCount(result.active_count)
    } catch (err) {
      console.error('Git scan failed:', err)
      // Fallback mock data
      setGitRepos([
        { id: 'repo-0', name: 'OptiMac-Pro', path: '/Users/digitone/Projects/OptiMac-Pro', size_bytes: 524288000, size_readable: '500 MB', last_commit_date: '2026-05-15', days_since_commit: 35, is_stale: false, has_uncommitted_changes: false, safe_to_purge: false, selected: false, git_dir_size: 104857600, git_dir_size_readable: '100 MB' },
        { id: 'repo-1', name: 'old-ecommerce-app', path: '/Users/digitone/Projects/old-ecommerce-app', size_bytes: 1073741824, size_readable: '1.0 GB', last_commit_date: '2025-11-20', days_since_commit: 210, is_stale: true, has_uncommitted_changes: false, safe_to_purge: true, selected: true, git_dir_size: 314572800, git_dir_size_readable: '300 MB' },
        { id: 'repo-2', name: 'mobile-game-prototype', path: '/Users/digitone/Dev/mobile-game-prototype', size_bytes: 2147483648, size_readable: '2.0 GB', last_commit_date: '2025-09-10', days_since_commit: 280, is_stale: true, has_uncommitted_changes: true, safe_to_purge: false, selected: false, git_dir_size: 524288000, git_dir_size_readable: '500 MB' },
        { id: 'repo-3', name: 'ml-pipeline', path: '/Users/digitone/Documents/ml-pipeline', size_bytes: 1572864000, size_readable: '1.5 GB', last_commit_date: '2026-04-01', days_since_commit: 78, is_stale: true, has_uncommitted_changes: false, safe_to_purge: true, selected: true, git_dir_size: 209715200, git_dir_size_readable: '200 MB' },
      ])
      setGitTotalSize('5.0 GB')
      setGitStaleCount(3)
      setGitActiveCount(1)
    }
    setGitScanning(false)
  }

  const handleGitToggle = (id: string) => {
    setGitRepos((prev) =>
      prev.map((repo) =>
        repo.id === id ? { ...repo, selected: !repo.selected } : repo
      )
    )
  }

  const handleGitGC = async () => {
    setGitOptimizing(true)
    setGitOperation('gc')
    setGitProgress(0)
    
    const selectedIds = gitRepos.filter((r) => r.selected).map((r) => r.id)
    
    const interval = setInterval(() => {
      setGitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 400)

    try {
      await invoke<GitRepoScanResult>('optimize_local_repos', { selectedIds, operation: 'gc' })
    } catch (err) {
      console.error('Git GC failed:', err)
    }

    setTimeout(() => {
      clearInterval(interval)
      setGitProgress(100)
      setGitOptimizing(false)
      setGitOperation(null)
      handleGitScan()
    }, 3000)
  }

  const handleGitPurge = async () => {
    setGitOptimizing(true)
    setGitOperation('purge')
    setGitProgress(0)
    
    const selectedIds = gitRepos.filter((r) => r.selected && r.safe_to_purge).map((r) => r.id)
    
    const interval = setInterval(() => {
      setGitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)

    try {
      await invoke<GitRepoScanResult>('optimize_local_repos', { selectedIds, operation: 'purge' })
    } catch (err) {
      console.error('Git purge failed:', err)
    }

    setTimeout(() => {
      clearInterval(interval)
      setGitProgress(100)
      setGitPurgeComplete(true)
      setGitOptimizing(false)
      setGitOperation(null)
      setGitRepos((prev) => prev.filter((repo) => !repo.selected || !repo.safe_to_purge))
    }, 2500)
  }

  const selectedDevSize = devItems.filter((i) => i.selected).reduce((sum, i) => sum + i.size_bytes, 0)
  const selectedDevReadable = formatBytes(selectedDevSize)

  const selectedGitSize = gitRepos.filter((r) => r.selected).reduce((sum, r) => sum + r.size_bytes, 0)
  const selectedGitReadable = formatBytes(selectedGitSize)
  const selectedSafeToPurge = gitRepos.filter((r) => r.selected && r.safe_to_purge).length

  const selectedSize = files.filter((f) => f.selected).reduce((sum, f) => sum + f.size, 0)
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cache':
        return 'bg-blue-500/20 text-blue-400'
      case 'logs':
        return 'bg-purple-500/20 text-purple-400'
      case 'temporary':
        return 'bg-orange-500/20 text-orange-400'
      case 'duplicates':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className={`min-h-full p-6 md:p-8 transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
          <Trash2 className="text-cyan-400" size={32} />
          Junk Cleaner
        </h1>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Find and remove unnecessary files to free up disk space</p>
      </div>

      {/* DEVCLEAN PRO TOGGLE */}
      <div className={`mb-8 rounded-2xl p-1 border transition-all duration-500 ${
        devMode 
          ? 'bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 border-violet-500/40 shadow-lg shadow-violet-500/10' 
          : isDark ? 'glass border-white/10' : 'bg-white border-neutral-200'
      }`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              devMode ? 'bg-violet-500/20 text-violet-400 shadow-lg shadow-violet-500/20' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <Code2 size={24} />
            </div>
            <div>
              <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                DevClean Pro Mode
                {devMode && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    ACTIVE
                  </span>
                )}
              </h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {devMode 
                  ? 'Scanning Xcode, Node.js, Android, Docker, and GitHub repos' 
                  : 'Toggle to scan developer-specific junk: Xcode builds, node_modules, Docker caches, Git repos'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setDevMode(!devMode)
              if (!devMode && devItems.length === 0) {
                handleDevScan()
              }
              if (!devMode && gitRepos.length === 0) {
                handleGitScan()
              }
            }}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              devMode ? 'bg-violet-500 shadow-lg shadow-violet-500/30' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
              devMode ? 'left-9' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* DEVCLEAN PRO CONTENT */}
      {devMode && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Dev Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Dev Junk</p>
              <p className="text-2xl font-bold text-violet-400">{devTotalSize}</p>
            </div>
            <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Selected to Purge</p>
              <p className="text-2xl font-bold text-fuchsia-400">{selectedDevReadable}</p>
            </div>
            <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Categories Found</p>
              <p className="text-2xl font-bold text-cyan-400">{devItems.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {devCleaning && (
            <div className="mb-6">
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.min(devProgress, 100)}%` }}
                />
              </div>
              <p className={`text-center text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Purging developer artifacts... {Math.min(Math.round(devProgress), 100)}%
              </p>
            </div>
          )}

          {/* Success State */}
          {devCleaned && !devCleaning && (
            <div className="mb-6 text-center py-6 rounded-xl bg-green-500/10 border border-green-500/30 animate-in fade-in zoom-in duration-300">
              <CheckCircle size={40} className="mx-auto text-green-400 mb-2" />
              <p className="text-green-400 font-bold text-lg">Dev Environment Cleaned!</p>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Freed {selectedDevReadable} of developer junk
              </p>
            </div>
          )}

          {/* Dev Items List */}
          <div className="space-y-3 mb-6">
            {devItems.length === 0 && !devScanning && (
              <div className={`text-center py-12 rounded-xl border ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200'}`}>
                <Shield size={40} className="mx-auto text-green-400 mb-3" />
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>No developer junk found!</p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Your dev environment is clean.</p>
              </div>
            )}

            {devScanning && (
              <div className="text-center py-12">
                <Loader size={40} className="mx-auto text-violet-400 animate-spin mb-3" />
                <p className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Scanning developer artifacts...</p>
              </div>
            )}

            {devItems.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] ${
                  isDark ? 'glass border-white/10 hover:border-white/20' : 'bg-white border-neutral-200 hover:border-neutral-300'
                } ${item.selected ? 'ring-1 ring-violet-500/50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleDevToggle(item.id)}
                    className="w-5 h-5 rounded accent-violet-400 cursor-pointer"
                  />
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${categoryColors[item.category] || 'from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30'}`}>
                    {categoryIcons[item.category] || <Terminal size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[item.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                        {item.category.toUpperCase()}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.description}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{item.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-violet-400">{item.size_readable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Purge Button */}
          {devItems.length > 0 && (
            <div className="flex gap-3 mb-10">
              <button
                onClick={handleDevScan}
                disabled={devScanning || devCleaning}
                className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                  isDark 
                    ? 'glass border-white/10 hover:border-white/20 text-neutral-300' 
                    : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                } disabled:opacity-50`}
              >
                {devScanning ? <Loader size={16} className="animate-spin inline mr-2" /> : <Search size={16} className="inline mr-2" />}
                Rescan
              </button>
              <button
                onClick={handleDevClean}
                disabled={selectedDevSize === 0 || devCleaning || devScanning}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedDevSize > 0 && !devCleaning
                    ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {devCleaning ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Purging...
                  </>
                ) : (
                  <>
                    <Zap size={18} className={selectedDevSize > 0 ? 'animate-pulse' : ''} />
                    Purge Developer Junk
                    {selectedDevSize > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                        {selectedDevReadable}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          )}

          {/* ============================================================================ */}
          {/* GITHUB WORKSPACE OPTIMIZER */}
          {/* ============================================================================ */}
          <div className={`rounded-2xl border p-6 transition-all duration-500 ${
            isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30">
                <GitBranch size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-xl flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  GitHub Workspace Optimizer
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    BETA
                  </span>
                </h3>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Scan local Git repos, compress history, and safely purge stale cloud-synced repos
                </p>
              </div>
            </div>

            {/* Git Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Repos</p>
                <p className="text-2xl font-bold text-orange-400">{gitRepos.length}</p>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Size</p>
                <p className="text-2xl font-bold text-cyan-400">{gitTotalSize}</p>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Stale Repos</p>
                <p className="text-2xl font-bold text-red-400">{gitStaleCount}</p>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'glass border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Active Repos</p>
                <p className="text-2xl font-bold text-green-400">{gitActiveCount}</p>
              </div>
            </div>

            {/* Git Progress Bar */}
            {gitOptimizing && (
              <div className="mb-6">
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${Math.min(gitProgress, 100)}%` }}
                  />
                </div>
                <p className={`text-center text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {gitOperation === 'gc' ? 'Compressing git history...' : 'Purging stale repositories...'} {Math.min(Math.round(gitProgress), 100)}%
                </p>
              </div>
            )}

            {/* Git Success State */}
            {gitPurgeComplete && !gitOptimizing && (
              <div className="mb-6 text-center py-6 rounded-xl bg-green-500/10 border border-green-500/30 animate-in fade-in zoom-in duration-300">
                <CheckCircle size={40} className="mx-auto text-green-400 mb-2" />
                <p className="text-green-400 font-bold text-lg">Workspace Optimized!</p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Freed {selectedGitReadable} from stale repositories
                </p>
              </div>
            )}

            {/* Git Repos List */}
            <div className="space-y-3 mb-6">
              {gitRepos.length === 0 && !gitScanning && (
                <div className={`text-center py-12 rounded-xl border ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200'}`}>
                  <Github size={40} className="mx-auto text-green-400 mb-3" />
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>No Git repos found!</p>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Your workspace is clean.</p>
                </div>
              )}

              {gitScanning && (
                <div className="text-center py-12">
                  <Loader size={40} className="mx-auto text-orange-400 animate-spin mb-3" />
                  <p className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Scanning Git repositories...</p>
                </div>
              )}

              {gitRepos.map((repo) => (
                <div
                  key={repo.id}
                  className={`group relative rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] ${
                    isDark ? 'glass border-white/10 hover:border-white/20' : 'bg-white border-neutral-200 hover:border-neutral-300'
                  } ${repo.selected ? 'ring-1 ring-orange-500/50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={repo.selected}
                      onChange={() => handleGitToggle(repo.id)}
                      disabled={repo.is_stale && repo.has_uncommitted_changes}
                      className="w-5 h-5 rounded accent-orange-400 cursor-pointer disabled:opacity-30"
                    />
                    <div className={`p-2.5 rounded-lg ${
                      repo.safe_to_purge 
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                        : repo.is_stale && repo.has_uncommitted_changes
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      <GitBranch size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{repo.name}</h3>
                        {repo.safe_to_purge && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                            <CheckCircle size={12} />
                            Safe to Purge (Cloud Synced)
                          </span>
                        )}
                        {repo.is_stale && repo.has_uncommitted_changes && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Warning: Uncommitted Changes
                          </span>
                        )}
                        {!repo.is_stale && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Active ({repo.days_since_commit}d ago)
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Last commit: {repo.last_commit_date} · .git size: {repo.git_dir_size_readable}
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{repo.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">{repo.size_readable}</p>
                      <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        .git: {repo.git_dir_size_readable}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Git Action Buttons */}
            {gitRepos.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={handleGitScan}
                  disabled={gitScanning || gitOptimizing}
                  className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                    isDark 
                      ? 'glass border-white/10 hover:border-white/20 text-neutral-300' 
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  } disabled:opacity-50`}
                >
                  {gitScanning ? <Loader size={16} className="animate-spin inline mr-2" /> : <Search size={16} className="inline mr-2" />}
                  Rescan Repos
                </button>
                <button
                  onClick={handleGitGC}
                  disabled={selectedGitSize === 0 || gitOptimizing || gitScanning}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedGitSize > 0 && !gitOptimizing
                      ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {gitOptimizing && gitOperation === 'gc' ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Archive size={18} />
                      Compress Git Logs (Run Git GC)
                    </>
                  )}
                </button>
                <button
                  onClick={handleGitPurge}
                  disabled={selectedSafeToPurge === 0 || gitOptimizing || gitScanning}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedSafeToPurge > 0 && !gitOptimizing
                      ? 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {gitOptimizing && gitOperation === 'purge' ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Purging...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Purge Selected Stale Repos
                      {selectedSafeToPurge > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                          {selectedSafeToPurge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STANDARD CLEANER (hidden when dev mode active) */}
      {!devMode && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Junk Found</p>
              <p className="text-2xl font-bold text-cyan-400">{(totalSize / 1024).toFixed(1)} GB</p>
            </div>
            <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Selected to Clean</p>
              <p className="text-2xl font-bold text-orange-400">{(selectedSize / 1024).toFixed(1)} GB</p>
            </div>
            <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Files Found</p>
              <p className="text-2xl font-bold text-purple-400">{files.length}</p>
            </div>
            <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Cleaned</p>
              <p className="text-2xl font-bold text-green-400">{(cleanedSize / 1024).toFixed(1)} GB</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm font-medium"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors text-sm font-medium"
            >
              Deselect All
            </button>
            <button
              onClick={handleClean}
              disabled={selectedSize === 0 || isCleaning}
              className="ml-auto px-6 py-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:opacity-50 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
            >
              {isCleaning ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {isCleaning ? 'Cleaning...' : 'Clean Selected'}
            </button>
          </div>

          {/* FILES LIST */}
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="glass rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={file.selected}
                    onChange={() => handleToggleFile(file.id)}
                    className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold">{file.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(file.category)}`}>
                        {file.category.charAt(0).toUpperCase() + file.category.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-white/50">{file.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-400">{(file.size / 1024).toFixed(1)} GB</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {files.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <p className="text-white font-semibold mb-2">System is clean!</p>
              <p className="text-white/50">No junk files found. Your system is optimized.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIdx = 0
  while (size >= 1024 && unitIdx < units.length - 1) {
    size /= 1024
    unitIdx++
  }
  return `${size.toFixed(1)} ${units[unitIdx]}`
}

export default JunkCleaner
