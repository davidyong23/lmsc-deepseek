// Vercel serverless function — proxies chat requests to DeepSeek.
//
// The whole point of this file is that the API key stays on the server. The
// browser calls /api/chat (same origin); this function attaches the key and
// forwards to DeepSeek. The key is never sent to the browser, so it cannot be
// read out of the deployed bundle.
//
//   GET  /api/chat  -> { available: boolean }   (is a key configured?)
//   POST /api/chat  -> { text } | { error }      (run one chat completion)

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'

// Prefer DEEPSEEK_API_KEY. Fall back to VITE_DEEPSEEK_API_KEY so an existing
// deployment keeps working during the switch — server-side, the VITE_ prefix
// carries no meaning, it is just another environment variable.
function getApiKey() {
  return process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ''
}

export default async function handler(req, res) {
  const apiKey = getApiKey()

  // Health check the client uses to decide live vs demo mode.
  if (req.method === 'GET') {
    return res.status(200).json({ available: Boolean(apiKey && apiKey.length > 10) })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!apiKey) {
    return res.status(503).json({ error: 'API key is not configured on the server' })
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Request must include a non-empty messages array' })
  }

  try {
    const upstream = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 1000, messages }),
    })

    if (!upstream.ok) {
      const errBody = await upstream.json().catch(() => ({}))
      const message = errBody?.error?.message || `Upstream API error ${upstream.status}`
      return res.status(upstream.status).json({ error: message })
    }

    const data = await upstream.json()
    const text = data.choices?.[0]?.message?.content
    // A 200 with no content is malformed — report it rather than pass an empty string.
    if (!text) {
      return res.status(502).json({ error: 'Empty response from API' })
    }
    return res.status(200).json({ text })
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Proxy request failed' })
  }
}
