export const vehicles = [
  { id: 'EV-01', zone: 'North', batteryPct: 82, rangeKm: 131, status: 'en_route',  currentDeliveries: 4, urgency: 'standard', lastCharge: '06:10', cyclesThisWeek: 3 },
  { id: 'EV-02', zone: 'South', batteryPct: 54, rangeKm: 86,  status: 'en_route',  currentDeliveries: 2, urgency: 'high',     lastCharge: '05:45', cyclesThisWeek: 5 },
  { id: 'EV-03', zone: 'East',  batteryPct: 28, rangeKm: 45,  status: 'idle',      currentDeliveries: 0, urgency: 'standard', lastCharge: '04:30', cyclesThisWeek: 6 },
  { id: 'EV-04', zone: 'North', batteryPct: 31, rangeKm: 49,  status: 'idle',      currentDeliveries: 3, urgency: 'standard', lastCharge: '05:00', cyclesThisWeek: 4 },
  { id: 'EV-05', zone: 'West',  batteryPct: 91, rangeKm: 145, status: 'en_route',  currentDeliveries: 5, urgency: 'critical', lastCharge: '06:50', cyclesThisWeek: 2 },
  { id: 'EV-06', zone: 'South', batteryPct: 17, rangeKm: 27,  status: 'charging',  currentDeliveries: 0, urgency: 'standard', lastCharge: '07:10', cyclesThisWeek: 7 },
  { id: 'EV-07', zone: 'East',  batteryPct: 63, rangeKm: 100, status: 'en_route',  currentDeliveries: 3, urgency: 'high',     lastCharge: '05:55', cyclesThisWeek: 4 },
  { id: 'EV-08', zone: 'West',  batteryPct: 45, rangeKm: 72,  status: 'idle',      currentDeliveries: 2, urgency: 'standard', lastCharge: '04:20', cyclesThisWeek: 5 },
]

export const routes = [
  { id: 'R-01', name: 'North Loop A',  zone: 'North', distanceKm: 11.4, energyKwh: 8.2,  timeMin: 34, congestionImpact: 'low',    co2SavedKg: 4.1, stops: 5 },
  { id: 'R-02', name: 'South Express', zone: 'South', distanceKm: 7.8,  energyKwh: 6.9,  timeMin: 28, congestionImpact: 'medium', co2SavedKg: 3.1, stops: 3 },
  { id: 'R-03', name: 'East Ring B',   zone: 'East',  distanceKm: 14.2, energyKwh: 13.1, timeMin: 52, congestionImpact: 'high',   co2SavedKg: 5.7, stops: 7 },
  { id: 'R-04', name: 'West Corridor', zone: 'West',  distanceKm: 9.1,  energyKwh: 7.4,  timeMin: 31, congestionImpact: 'low',    co2SavedKg: 3.3, stops: 4 },
  { id: 'R-05', name: 'North Bypass',  zone: 'North', distanceKm: 8.6,  energyKwh: 6.1,  timeMin: 27, congestionImpact: 'low',    co2SavedKg: 2.7, stops: 3 },
  { id: 'R-06', name: 'East Grid D',   zone: 'East',  distanceKm: 16.3, energyKwh: 15.8, timeMin: 68, congestionImpact: 'high',   co2SavedKg: 6.5, stops: 8 },
]

export const congestionZones = [
  { zone: 'North', index: 45, level: 'moderate', peakWindow: true,  avoidRecommended: false },
  { zone: 'South', index: 61, level: 'high',     peakWindow: true,  avoidRecommended: true  },
  { zone: 'East',  index: 87, level: 'critical', peakWindow: true,  avoidRecommended: true  },
  { zone: 'West',  index: 33, level: 'low',      peakWindow: false, avoidRecommended: false },
]

export const kpiSummary = {
  co2SavedKgToday: 34.2,
  onTimeRatePct: 91,
  totalDeliveriesToday: 47,
  deliveriesCompleted: 43,
}

export const sustainability = {
  energyEfficiencyScore: 83,
  renewableChargeSharePct: 61,
  avgKwhPer100Km: 18.4,
  dieselEquivalentSavedL: 13.7,
}

export function getVehicleRecommendation(v) {
  // 1. Currently charging — check before battery level; EV may be low AND charging
  if (v.status === 'charging') {
    return { text: 'Charging — do not dispatch', risk: 'info' }
  }
  // 2. Critical battery — charge immediately
  if (v.batteryPct < 20) {
    return { text: 'Charge immediately — do not dispatch', risk: 'critical' }
  }
  // 3. Low battery + critical urgency — surface the conflict explicitly
  if (v.batteryPct < 35 && v.urgency === 'critical') {
    return { text: 'SLA conflict: charge vs urgency — escalate', risk: 'critical' }
  }
  // 4. Low battery — short-zone only
  if (v.batteryPct < 35) {
    return { text: 'Short-zone only (<8 km)', risk: 'warning' }
  }
  // 5. Good battery — surface SLA urgency
  if (v.urgency === 'critical') {
    return { text: 'Dispatch immediately — SLA active', risk: 'critical' }
  }
  if (v.urgency === 'high') {
    return { text: 'Prioritise dispatch — HIGH SLA', risk: 'warning' }
  }
  // 6. Optimal battery — preserve charge cycles
  if (v.batteryPct >= 80) {
    return { text: 'Ready — avoid top-up charge', risk: 'success' }
  }
  return { text: 'Ready to dispatch', risk: 'success' }
}
