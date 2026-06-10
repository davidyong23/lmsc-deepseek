import { Battery, Leaf, CheckCircle2, AlertTriangle } from 'lucide-react'
import { vehicles, kpiSummary, sustainability } from '../../data/mockData'

// Compute avg battery live from the vehicles array — not hardcoded
const computedAvgBattery = Math.round(
  vehicles.reduce((sum, v) => sum + v.batteryPct, 0) / vehicles.length
)

const cards = [
  {
    key: 'battery',
    label: 'Avg Fleet Battery',
    value: `${computedAvgBattery}%`,
    sub: `${vehicles.length} vehicles active`,
    icon: Battery,
    color: computedAvgBattery >= 60 ? 'text-success' : computedAvgBattery >= 40 ? 'text-warning' : 'text-danger',
    bg: computedAvgBattery >= 60 ? 'bg-success/10' : computedAvgBattery >= 40 ? 'bg-warning/10' : 'bg-danger/10',
    border: computedAvgBattery >= 60 ? 'border-l-success' : computedAvgBattery >= 40 ? 'border-l-warning' : 'border-l-danger',
    trend: '↓ 4% vs yesterday',
    trendColor: 'text-danger',
  },
  {
    key: 'co2',
    label: 'CO₂ Saved Today',
    value: `${kpiSummary.co2SavedKgToday} kg`,
    sub: 'vs diesel baseline',
    icon: Leaf,
    color: 'text-eco',
    bg: 'bg-eco/10',
    border: 'border-l-eco',
    trend: '↑ 2.1 kg vs yesterday',
    trendColor: 'text-eco',
  },
  {
    key: 'ontime',
    label: 'On-Time Rate',
    value: `${kpiSummary.onTimeRatePct}%`,
    sub: `${kpiSummary.deliveriesCompleted}/${kpiSummary.totalDeliveriesToday} deliveries`,
    icon: CheckCircle2,
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-l-accent',
    trend: '→ No change',
    trendColor: 'text-slate-400',
  },
  {
    key: 'renewable',
    label: 'Renewable Charge Share',
    value: `${sustainability.renewableChargeSharePct}%`,
    sub: sustainability.renewableChargeSharePct < 70 ? '⚠ Below 70% target' : '✓ Within target',
    icon: AlertTriangle,
    color: sustainability.renewableChargeSharePct < 70 ? 'text-warning' : 'text-success',
    bg: sustainability.renewableChargeSharePct < 70 ? 'bg-warning/10' : 'bg-success/10',
    border: sustainability.renewableChargeSharePct < 70 ? 'border-l-warning' : 'border-l-success',
    trend: `Eff. score: ${sustainability.energyEfficiencyScore}/100`,
    trendColor: 'text-slate-400',
  },
]

export default function KPICards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div key={c.key} className={`kpi-card border-l-4 ${c.border}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <Icon size={16} className={c.color} />
              </div>
              <span className={`text-[10px] font-medium font-mono ${c.trendColor}`}>
                {c.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-white leading-none mb-1">{c.value}</div>
            <div className="text-xs font-medium text-slate-300 mb-0.5">{c.label}</div>
            <div className={`text-[10px] ${c.key === 'renewable' && sustainability.renewableChargeSharePct < 70 ? 'text-warning' : 'text-slate-500'}`}>
              {c.sub}
            </div>
          </div>
        )
      })}
    </div>
  )
}
