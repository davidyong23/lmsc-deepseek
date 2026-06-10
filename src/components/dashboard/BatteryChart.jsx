import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts'
import { vehicles } from '../../data/mockData'
import { BatteryMedium } from 'lucide-react'

const STATUS_COLOR = {
  en_route: '#3b82f6',
  idle:     '#64748b',
  charging: '#22c55e',
}

const STATUS_LABEL = {
  en_route: 'En Route',
  idle:     'Idle',
  charging: 'Charging',
}

function getBatteryColor(pct) {
  if (pct >= 60) return '#22c55e'
  if (pct >= 30) return '#f59e0b'
  return '#ef4444'
}

const chartData = vehicles.map(v => ({
  id: v.id,
  battery: v.batteryPct,
  range: v.rangeKm,
  status: v.status,
  urgency: v.urgency,
  cycles: v.cyclesThisWeek,
  zone: v.zone,
}))

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const urgencyColor = d.urgency === 'critical' ? '#ef4444' : d.urgency === 'high' ? '#f59e0b' : '#64748b'
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-xs shadow-xl">
      <div className="font-semibold text-white mb-2 font-mono">{d.id}</div>
      <div className="space-y-1 text-slate-300">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Battery</span>
          <span className="font-mono" style={{ color: getBatteryColor(d.battery) }}>{d.battery}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Est. Range</span>
          <span className="font-mono">{d.range} km</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Status</span>
          <span style={{ color: STATUS_COLOR[d.status] }}>{STATUS_LABEL[d.status]}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Zone</span>
          <span>{d.zone}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Urgency</span>
          <span className="font-semibold capitalize" style={{ color: urgencyColor }}>{d.urgency}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Cycles/wk</span>
          <span className="font-mono" style={{ color: d.cycles >= 6 ? '#ef4444' : '#94a3b8' }}>{d.cycles}</span>
        </div>
      </div>
    </div>
  )
}

export default function BatteryChart() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BatteryMedium size={16} className="text-accent" />
          <span className="text-sm font-semibold text-white">Fleet Battery State</span>
        </div>
        <div className="flex items-center gap-3">
          {[['≥60%', '#22c55e'], ['30–59%', '#f59e0b'], ['<30%', '#ef4444']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-[10px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          barSize={28}
        >
          <XAxis
            dataKey="id"
            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#2a3044' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}%`}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
          {/* Dispatch threshold lines */}
          <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6}
            label={{ value: 'Short-zone limit', position: 'insideTopRight', fill: '#f59e0b', fontSize: 9 }} />
          <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6}
            label={{ value: 'Critical threshold', position: 'insideTopRight', fill: '#ef4444', fontSize: 9 }} />
          <Bar dataKey="battery" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={getBatteryColor(entry.battery)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="border-t border-border pt-2 mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>Dashed lines show dispatch thresholds</span>
        <span>Red cycle count = ≥6/week (degradation risk)</span>
      </div>
    </div>
  )
}
