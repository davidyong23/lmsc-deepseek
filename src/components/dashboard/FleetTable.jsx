import { vehicles, getVehicleRecommendation } from '../../data/mockData'
import { Truck } from 'lucide-react'
import { getBatteryColor } from '../../utils/batteryColor'

const STATUS_STYLES = {
  en_route: { label: 'En Route', class: 'bg-accent/20 text-accent border-accent/30' },
  idle:     { label: 'Idle',     class: 'bg-slate-700/50 text-slate-300 border-slate-600' },
  charging: { label: 'Charging', class: 'bg-eco/20 text-eco border-eco/30' },
  offline:  { label: 'Offline',  class: 'bg-danger/20 text-danger border-danger/30' },
}

const URGENCY_STYLES = {
  standard: { label: 'Std',      class: 'text-slate-400' },
  high:     { label: '⚡ High',  class: 'text-warning font-semibold' },
  critical: { label: '🔴 SLA',   class: 'text-danger font-bold' },
}

const RISK_STYLES = {
  success:  'text-success',
  warning:  'text-warning',
  critical: 'text-danger font-medium',
  info:     'text-slate-400',
}

// Phrases the row as an operator would ask it, using only live vehicle data.
function buildVehicleQuestion(v) {
  const status = v.status.replace('_', ' ')
  const urgency = v.urgency !== 'standard' ? `, ${v.urgency.toUpperCase()} urgency` : ''
  return `${v.id} is at ${v.batteryPct}% in ${v.zone} zone (${status}${urgency}). What's your recommendation for this vehicle?`
}

function BatteryBar({ pct }) {
  const color = getBatteryColor(pct)
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="battery-bar flex-1">
        <div className="battery-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono font-medium w-8 text-right" style={{ color }}>
        {pct}%
      </span>
    </div>
  )
}

export default function FleetTable({ onAskAboutVehicle }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Truck size={16} className="text-accent" />
        <span className="text-sm font-semibold text-white">Fleet Status</span>
        <span className="ml-auto text-[10px] text-slate-500 hidden sm:inline">Click a vehicle to ask LMSC</span>
        <span className="text-[10px] text-slate-500 font-mono sm:border-l sm:border-border sm:pl-2">{vehicles.length} vehicles</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/80">
              {['Vehicle', 'Zone', 'Battery', 'Status', 'Urgency', 'Recommendation'].map(h => (
                <th
                  key={h}
                  className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest py-2.5 pr-4 last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {vehicles.map((v) => {
              const rec = getVehicleRecommendation(v)
              const status = STATUS_STYLES[v.status] || STATUS_STYLES.offline
              const urgency = URGENCY_STYLES[v.urgency] || URGENCY_STYLES.standard
              const isHighRisk = rec.risk === 'critical'

              const ask = () => onAskAboutVehicle(buildVehicleQuestion(v))

              return (
                <tr
                  key={v.id}
                  onClick={ask}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      ask()
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ask LMSC about ${v.id}`}
                  title={`Ask LMSC about ${v.id}`}
                  className={`cursor-pointer hover:bg-accent/[0.07] focus:outline-none focus:bg-accent/10 transition-colors ${isHighRisk ? 'bg-danger/5' : ''}`}
                >
                  <td className="py-2.5 pr-4 font-mono font-medium text-white">{v.id}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{v.zone}</td>
                  <td className="py-2.5 pr-4"><BatteryBar pct={v.batteryPct} /></td>
                  <td className="py-2.5 pr-4">
                    <span className={`status-pill border ${status.class}`}>{status.label}</span>
                  </td>
                  <td className={`py-2.5 pr-4 ${urgency.class}`}>{urgency.label}</td>
                  <td className={`py-2.5 ${RISK_STYLES[rec.risk]}`}>{rec.text}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
