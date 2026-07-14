import { useEffect, useRef } from 'react'
import { Bot, WifiOff } from 'lucide-react'
import { isApiAvailable } from '../../services/deepseekApi'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center">
        <Bot size={13} className="text-accent/60" />
      </div>
      <div className="chat-bubble-agent flex items-center gap-1 py-3.5">
        <div className="dot-typing flex items-center">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

// Chat state lives in App (via useChat) and is passed in as props so the
// desktop and mobile panels render the same conversation and input draft.
export default function ChatPanel({ messages, isLoading, sendUserMessage, draft, onDraftChange, focusSignal }) {
  const bottomRef = useRef(null)
  const apiAvailable = isApiAvailable()

  // Only show suggestions if only the welcome message is present
  const showSuggestions = messages.length === 1

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full card overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0 bg-surface/60">
        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
          <Bot size={16} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">LMSC Agent</div>
          <div className="text-[10px] text-slate-500">Last-Mile Sustainability Coach</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${isLoading ? 'bg-warning animate-pulse' : 'bg-success'}`}
            style={{ boxShadow: isLoading ? '0 0 5px #f59e0b' : '0 0 5px #22c55e' }}
          />
          <span className="text-[10px] text-slate-400">
            {isLoading ? 'Thinking…' : 'Online'}
          </span>
        </div>
      </div>

      {/* Demo mode banner */}
      {!apiAvailable && (
        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border-b border-warning/20">
          <WifiOff size={12} className="text-warning flex-shrink-0" />
          <span className="text-[11px] text-warning">
            Demo mode — add <span className="font-mono">VITE_DEEPSEEK_API_KEY</span> to <span className="font-mono">.env</span> for live AI responses
          </span>
        </div>
      )}

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendUserMessage}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        draft={draft}
        onDraftChange={onDraftChange}
        focusSignal={focusSignal}
      />
    </div>
  )
}
