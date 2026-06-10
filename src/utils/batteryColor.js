/**
 * Returns a hex colour for a battery percentage level.
 * Used consistently across BatteryChart and FleetTable
 * so both components always display the same colour for the same level.
 *
 * Thresholds:
 *   ≥ 60 %  → green  (healthy)
 *   ≥ 30 %  → amber  (watch)
 *   < 30 %  → red    (critical)
 */
export function getBatteryColor(pct) {
  if (pct >= 60) return '#22c55e'
  if (pct >= 30) return '#f59e0b'
  return '#ef4444'
}
