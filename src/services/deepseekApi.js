import { buildSystemPrompt } from '../config/systemPrompt'

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'

export const isApiAvailable = () => Boolean(API_KEY && API_KEY.length > 10)

// Fallback responses for demo mode (no API key present)
const FALLBACK_RESPONSES = [
  `Based on current fleet data, EV-04 at 31% is borderline for dispatch. At that level, I'd limit it to short-zone routes under 8 km — North Bypass at 8.6 km is marginal; North Loop A at 11.4 km is too long. My suggestion: hold EV-04 for the 3 pending deliveries only if they're all within 6 km of the depot. Otherwise, charge first — 20 minutes on fast charge should bring it to ~45%. Also note: EV-04 is at 4 cycles this week, which is within limits.`,

  `Congestion in East Zone is at 87 — critical. I'd pull any non-urgent vehicles off East Ring B and East Grid D immediately. The energy penalty from stop-start traffic at that congestion level adds roughly 22–28% to consumption estimates. Reroute options:\n\n• Option A (fastest): South Express via Zone South — 7.8 km, medium congestion, +12 min vs direct\n• Option B (greenest): West Corridor — 9.1 km, low congestion, best energy efficiency at 7.4 kWh\n• Recommendation: West Corridor. Lower congestion index saves battery and maintains schedule within acceptable variance. CO₂ saving vs East Ring B: ~5.7 kg.`,

  `Conflicting constraints noted — this is a genuine trade-off. EV-06 is at 17% battery with a critical medical delivery. Here are your options:\n\n• Option A (safety-first): Delay and reassign to EV-05 (91%, West Zone) — adds 15–20 min transit to the delivery zone. SLA impact: borderline for CRITICAL threshold.\n• Option B (accept risk): Dispatch EV-06 now. Estimated range is 27 km — sufficient if the route is under 20 km, but with zero buffer. Any deviation or congestion delay creates a stranding risk.\n\nI cannot recommend Option B given the battery level. The operational and liability risk of a stranded medical vehicle outweighs the time saving. Reassign to EV-05. Escalate the SLA delay to the operator now.`,

  `Charge scheduling recommendation for this shift: current renewable energy share is 61% — below the 70% green compliance target. To improve this:\n\n• Schedule EV-03 (28%, idle, East) for an off-peak charge starting now — East Zone is congested so it shouldn't be dispatched anyway. Targeting an 80% charge via a scheduled cycle rather than a top-up will reduce degradation risk (EV-03 is already at 6 cycles this week — at the limit).\n• Hold EV-04 charging until after 21:00 when grid renewable share is typically higher.\n\nProjected improvement: +4–6% renewable share if off-peak scheduling is applied to 3 vehicles tonight. Sustainability score delta: approximately +3 points.`,

  `What-if: EV-07 reassigned from East Ring B to West Corridor.\n\n• Energy delta: East Ring B uses 13.1 kWh vs West Corridor at 7.4 kWh — saving 5.7 kWh per trip.\n• Time delta: West Corridor adds ~3 km distance but saves ~21 min due to lower congestion (index 33 vs 87).\n• On-time rate impact: positive — faster completion improves OTR by an estimated 1–2%.\n• Sustainability score delta: +2 points from reduced energy consumption and congestion avoidance.\n\nRecommendation: Reassign EV-07 to West Corridor immediately. EV-07 at 63% has sufficient range for either route, but the efficiency gain is substantial. This is the clear optimal choice.`,

  `Current sustainability score: 83/100 — solid, but three actions would move the needle today:\n\n1. Reroute EV-03 and EV-07 off East Zone routes — saves ~6.4 kWh this shift, worth ~4.8 kg CO₂ avoided. Score delta: +3–4 points.\n2. Enforce charge discipline on EV-06 — it's at 7 cycles this week, above the 6-cycle degradation threshold. Schedule a full cycle (20%→80%) rather than a shallow top-up.\n3. Target off-peak charging for EV-04 and EV-08 tonight to push renewable share from 61% toward the 70% compliance target.\n\nCombined projected score: approximately 88–90/100 by end of shift.`,
]

let fallbackIndex = 0

function getFallbackResponse() {
  const response = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length]
  fallbackIndex++
  return response
}

export async function sendMessage(conversationHistory) {
  if (!isApiAvailable()) {
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
    return { text: getFallbackResponse(), error: null }
  }

  const systemPrompt = buildSystemPrompt()

  // DeepSeek uses OpenAI-compatible format:
  // system prompt as first message with role "system",
  // then the conversation history with roles "user" / "assistant"
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({
      role: m.role,       // already "user" or "assistant"
      content: m.content,
    })),
  ]

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 1000,
        messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `API error ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    // A 200 response with no message content is malformed — surface it as an
    // error instead of rendering an empty chat bubble.
    if (!text) throw new Error('Empty response from API')
    return { text, error: null }
  } catch (err) {
    return { text: null, error: err.message || 'Unknown error' }
  }
}
