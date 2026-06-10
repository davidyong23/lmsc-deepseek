import { useState, useCallback } from 'react'
import { sendMessage } from '../services/deepseekApi'
import { kpiSummary, sustainability, vehicles, congestionZones } from '../data/mockData'

function buildWelcomeMessage() {
  const lowBattery = vehicles.filter(v => v.batteryPct < 35 && v.status !== 'charging')
  const charging = vehicles.filter(v => v.status === 'charging')
  const slaActive = vehicles.filter(v => v.urgency === 'critical' || v.urgency === 'high')
  const avoidZones = congestionZones.filter(z => z.avoidRecommended)

  const lowBatteryStr = lowBattery.length > 0
    ? `${lowBattery.length} vehicle${lowBattery.length > 1 ? 's' : ''} below the 35% dispatch threshold (${lowBattery.map(v => v.id).join(', ')})`
    : 'all vehicles above the 35% dispatch threshold'

  const chargingStr = charging.length > 0
    ? `${charging.map(v => v.id).join(', ')} currently charging`
    : 'no vehicles on charge'

  const zonesStr = avoidZones.length > 0
    ? `${avoidZones.map(z => `${z.zone} (${z.index})`).join(' and ')} zone${avoidZones.length > 1 ? 's' : ''} flagged for avoidance`
    : 'no zones flagged for avoidance'

  const slaStr = slaActive.length > 0
    ? ` ${slaActive.length} SLA-active vehicle${slaActive.length > 1 ? 's' : ''} on shift (${slaActive.map(v => `${v.id}: ${v.urgency}`).join(', ')}).`
    : ''

  const renewableWarning = sustainability.renewableChargeSharePct < 70
    ? `Renewable charge share at ${sustainability.renewableChargeSharePct}% — below the 70% green compliance target.`
    : `Renewable charge share at ${sustainability.renewableChargeSharePct}% — within target.`

  return `Good morning, Operator. I'm LMSC — your Last-Mile Sustainability Coach.

Fleet status: ${vehicles.length} active vehicles, ${kpiSummary.onTimeRatePct}% on-time rate, ${kpiSummary.co2SavedKgToday} kg CO₂ saved today.

Current alerts: ${zonesStr}. ${lowBatteryStr}, and ${chargingStr}.${slaStr}

${renewableWarning}

How can I help you optimise this shift?`
}

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: buildWelcomeMessage(),
  timestamp: new Date(),
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)

  const sendUserMessage = useCallback(async (userText) => {
    if (!userText.trim() || isLoading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const history = [...messages, userMessage]
      .filter(m => m.id !== 'welcome' && !m.isError)
      .map(m => ({ role: m.role, content: m.content }))

    const { text, error: apiError } = await sendMessage(history)

    if (apiError) {
      const errMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting right now. Please check your API configuration or try again in a moment.\n\nError: ${apiError}`,
        timestamp: new Date(),
        isError: true,
      }
      setMessages(prev => [...prev, errMsg])
    } else {
      const assistantMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    }

    setIsLoading(false)
  }, [messages, isLoading])

  return { messages, isLoading, sendUserMessage }
}
