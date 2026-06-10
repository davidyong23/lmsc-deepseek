import { useState, useEffect } from 'react'
import { Zap, Activity } from 'lucide-react'
import { isApiAvailable } from '../../services/deepseekApi'
import { congestionZones } from '../../data/mockData'

export default function TopBar() {
  const [time, setTime] = useState(new Date())
  const apiOk = isApiAvailable()

  const peakActive = congestionZones.some(z => z.avoidRecommended)
  const avoidCount = congestionZones.filter(z => z.avoidRecommended).length

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('en-SG', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const dateStr = time.toLocaleDateString('en-SG', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border flex items-center justify-between px-6 h-14">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
          <Zap size={16} className="text-accent" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-wide text-white">LMSC</span>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Last-Mile Sustainability Coach</span>
        </div>
      </div>

      {/* Centre — data-driven congestion banner */}
      {peakActive && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/25">
          <Activity size={13} className="text-warning animate-pulse" />
          <span className="text-xs text-warning font-medium">
            Peak Congestion — {avoidCount} Zone{avoidCount > 1 ? 's' : ''} Flagged for Avoidance
          </span>
        </div>
      )}

      {/* Right — status + clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${apiOk ? 'bg-success' : 'bg-warning'}`}
            style={{ boxShadow: apiOk ? '0 0 6px #22c55e' : '0 0 6px #f59e0b' }}
          />
          <span className="text-xs text-slate-400 hidden sm:inline">
            {apiOk ? 'Live Mode' : 'Demo Mode'}
          </span>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-sm font-mono text-white">{timeStr}</div>
          <div className="text-[10px] text-slate-500">{dateStr}</div>
        </div>
      </div>
    </header>
  )
}
