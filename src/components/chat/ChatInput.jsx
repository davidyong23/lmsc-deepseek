import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

const SUGGESTED_PROMPTS = [
  'EV-06 just got a critical medical delivery — what do I do?',
  'What-if I reroute EV-07 off East Ring B — energy and time impact?',
  'How do I improve our renewable charge share above 70%?',
  'Which vehicles are at degradation risk this week?',
]

// The draft is controlled by App so the fleet table can write into it.
export default function ChatInput({ onSend, isLoading, showSuggestions, draft, onDraftChange, focusSignal }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`
    }
  }, [draft])

  // A fleet-row click bumps focusSignal. Both chat panels are mounted at all
  // times, so only the one actually visible at this breakpoint takes focus.
  useEffect(() => {
    if (!focusSignal) return
    const el = textareaRef.current
    if (el && el.offsetParent !== null) el.focus()
  }, [focusSignal])

  const handleSend = () => {
    if (!draft.trim() || isLoading) return
    onSend(draft.trim())
    onDraftChange('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (prompt) => {
    if (!isLoading) onSend(prompt)
  }

  return (
    <div className="border-t border-border bg-surface">
      {/* Suggested prompt chips — shown only on empty chat */}
      {showSuggestions && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(p)}
              disabled={isLoading}
              className="text-[11px] text-slate-400 border border-border hover:border-accent/50 hover:text-accent bg-card px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-40 text-left"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3 p-4">
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={e => onDraftChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={isLoading}
          placeholder="Ask about routing, battery health, dispatch decisions…"
          className="
            flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-slate-200
            placeholder:text-slate-600 resize-none outline-none
            focus:border-accent/60 focus:ring-1 focus:ring-accent/20
            transition-all duration-150 disabled:opacity-50
            min-h-[42px] max-h-24 leading-relaxed
          "
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !draft.trim()}
          className="btn-primary flex-shrink-0 h-[42px] w-[42px] flex items-center justify-center rounded-lg"
          title="Send (Enter)"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
