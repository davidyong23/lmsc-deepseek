import { congestionZones, sustainability } from '../../data/mockData'
import { MapPin, Gauge, AlertTriangle } from 'lucide-react'

const LEVEL_CONFIG = {
  low:      { color: '#22c55e', bg: 'bg-success/10',  border: 'border-success/25', label: 'Low' },
  moderate: { color: '#f59e0b', bg: 'bg-warning/10',  border: 'border-warning/25', label: 'Moderate' },
  high:     { color: '#ef4444', bg: 'bg-danger/10',   border: 'border-danger/25',  label: 'High' },
  critical: { color: '#ef4444', bg: 'bg-danger/15',   border: 'border-danger/40',  label: 'Critical' },
}

function ZoneCard({ zone, index, level, avoidRecommended }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.low
  return (
    <div className={`card p-3 ${cfg.bg} ${cfg.border} border`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} style={{ color: cfg.color }} />
          <span className="text-xs font-semibold text-white">{zone}</span>
        </div>
        {avoidRecommended && (
          <span className="badge-avoid text-[9px] px-1.5 py-0.5">AVOID</span>
        )}
      </div>
      <div className="mb-2">
        <div className="flex items-end gap-1">
          <span className="text-xl font-bold font-mono" style={{ color: cfg.color, textShadow: `0 0 12px ${cfg.color}55` }}>{index}</span>
          <span className="text-xs text-slate-500 mb-0.5">/100</span>
        </div>
        <span className="text-[10px] font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
      </div>
      <div className="h-1 bg-black/30 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${index}%`, background: cfg.color }}
        />
      </div>
    </div>
  )
}

export default function CongestionPanel() {
  const renewableBelowTarget = sustainability.renewableChargeSharePct < 70
  const networkCongestionIndex = Math.round(
    congestionZones.reduce((sum, z) => sum + z.index, 0) / congestionZones.length
  )

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-accent" />
          <span className="text-sm font-semibold text-white">Zone Congestion</span>
        </div>
        {/* Congestion index is an overall network-weighted average */}
        <div className="text-[10px] text-slate-400">
          Network index: <span className="text-white font-mono font-semibold">{networkCongestionIndex}/100</span>
          <span className="text-slate-600 ml-1">(avg)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {congestionZones.map(z => (
          <ZoneCard key={z.zone} {...z} />
        ))}
      </div>

      {/* Sustainability footer */}
      <div className="border-t border-border pt-3 space-y-1.5">
        {renewableBelowTarget && (
          <div className="flex items-center gap-2 text-[11px] text-warning bg-warning/5 border border-warning/20 rounded px-2.5 py-1.5">
            <AlertTriangle size={11} className="flex-shrink-0" />
            <span>Renewable share {sustainability.renewableChargeSharePct}% — below 70% compliance target. Schedule off-peak charging.</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Avg kWh/100km: <span className="text-slate-300 font-mono">{sustainability.avgKwhPer100Km}</span></span>
          <span>Diesel saved: <span className="text-eco font-mono">{sustainability.dieselEquivalentSavedL} L</span></span>
          <span>Eff. score: <span className="text-slate-300 font-mono">{sustainability.energyEfficiencyScore}/100</span></span>
        </div>
      </div>
    </div>
  )
}
