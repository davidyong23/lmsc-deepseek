import { Bot, User } from 'lucide-react'

function formatTime(date) {
  return date instanceof Date
    ? date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''
}

// Convert plain text with line breaks / bullets into JSX
function renderContent(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    // Bullet lines
    if (line.startsWith('•') || line.startsWith('-')) {
      return (
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-slate-500 mt-0.5 flex-shrink-0">•</span>
          <span>{line.replace(/^[•\-]\s*/, '')}</span>
        </div>
      )
    }
    // Option lines (Option A / Option B / Recommendation)
    if (/^(Option [A-C]|Recommendation):/i.test(line)) {
      const [label, ...rest] = line.split(':')
      return (
        <div key={i} className="my-1">
          <span className="text-accent font-semibold">{label}:</span>
          <span>{rest.join(':')}</span>
        </div>
      )
    }
    return <p key={i} className="my-0.5">{line}</p>
  })
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2.5 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5
        ${isUser ? 'bg-accent/20 border border-accent/40' : 'bg-surface border border-border'}
      `}>
        {isUser
          ? <User size={13} className="text-accent" />
          : <Bot size={13} className="text-slate-400" />
        }
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`
          text-xs text-slate-500 flex items-center gap-2 px-1
          ${isUser ? 'flex-row-reverse' : ''}
        `}>
          <span className="font-medium">{isUser ? 'You' : 'LMSC'}</span>
          <span>{formatTime(message.timestamp)}</span>
        </div>

        <div className={`
          ${isUser ? 'chat-bubble-user' : 'chat-bubble-agent'}
          ${message.isError ? 'border-danger/50 bg-danger/5' : ''}
        `}>
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  )
}
