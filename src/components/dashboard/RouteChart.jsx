import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts'
import { routes } from '../../data/mockData'
import { TrendingUp } from 'lucide-react'

const CONGESTION_COLOR = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
}

const CONGESTION_LABEL = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
}

const maxKwh = Math.max(...routes.map(r => r.energyKwh))
const xAxisMax = Math.ceil(maxKwh / 5) * 5

const chartData = routes.map(r => ({
  name: r.name,
  kWh: r.energyKwh,
  km: r.distanceKm,
  time: r.timeMin,
  co2: r.co2SavedKg,
  impact: r.congestionImpact,
  stops: r.stops,
}))

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-xs shadow-xl">
      <div className="font-semibold text-white mb-2">{d.name}</div>
      <div className="space-y-1 text-slate-300">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Energy</span>
          <span className="font-mono">{d.kWh} kWh</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Distance</span>
          <span className="font-mono">{d.km} km</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Est. Time</span>
          <span className="font-mono">{d.time} min</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">CO₂ Saved</span>
          <span className="font-mono text-eco">{d.co2} kg</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Congestion</span>
          <span
            className="font-mono font-semibold"
            style={{ color: CONGESTION_COLOR[d.impact] }}
          >
            {CONGESTION_LABEL[d.impact]}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function RouteChart() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" />
          <span className="text-sm font-semibold text-white">Route Energy Consumption</span>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(CONGESTION_COLOR).map(([k, color]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-[10px] text-slate-400 capitalize">{k}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          // bottom margin reserves room for the axis label; at 0 it clips
          margin={{ top: 0, right: 48, bottom: 16, left: 4 }}
          barSize={14}
        >
          <XAxis
            type="number"
            domain={[0, xAxisMax]}
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#2a3044' }}
            label={{ value: 'kWh consumed', position: 'insideBottomRight', offset: -4, fill: '#475569', fontSize: 9 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
          <Bar dataKey="kWh" radius={[0, 3, 3, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={CONGESTION_COLOR[entry.impact]} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="kWh"
              position="right"
              formatter={v => `${v}`}
              style={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
