import { useState, useEffect } from 'react'
import { checkApiAvailability } from '../services/deepseekApi'

// Resolves the live/demo mode by asking the serverless proxy whether a key is
// configured. Returns 'checking' until the answer is in, then 'live' or 'demo'.
// The underlying check is cached in the service, so mounting this in more than
// one component still only makes a single request.
export function useApiStatus() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let active = true
    checkApiAvailability().then(ok => {
      if (active) setStatus(ok ? 'live' : 'demo')
    })
    return () => { active = false }
  }, [])

  return status
}
