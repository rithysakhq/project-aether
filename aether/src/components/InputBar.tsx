import { useRef, useEffect, useCallback, useState } from 'react'
import { useStore } from '../store/useStore'

interface InputBarProps {
  onSend: (text: string) => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

export function InputBar({ onSend, inputRef }: InputBarProps) {
  const isStreaming = useStore((s) => s.isStreaming)
  const setStreaming = useStore((s) => s.setStreaming)
  const selectedModel = useStore((s) => s.selectedModel)
  const autoRoute = useStore((s) => s.settings.autoRoute)
  const [hasText, setHasText] = useState(false)
  const localRef = useRef<HTMLTextAreaElement>(null)
  const textareaRef = inputRef || localRef

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '22px'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
    setHasText(el.value.trim().length > 0)
  }, [textareaRef])

  useEffect(() => {
    resize()
  }, [resize])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const text = textareaRef.current?.value.trim()
      if (!text || isStreaming) return
      onSend(text)
      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.style.height = '22px'
      }
      setHasText(false)
    }
  }

  const handleSendClick = () => {
    if (isStreaming) {
      setStreaming(false)
      return
    }
    const text = textareaRef.current?.value.trim()
    if (!text) return
    onSend(text)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = '22px'
    }
    setHasText(false)
  }

  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-end bg-surface2 rounded-[12px] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-shadow duration-150">
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onInput={resize}
          placeholder="Message Aether..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] text-text placeholder:text-muted/30 px-4 py-3 font-sans"
          style={{ height: '22px', minHeight: '22px', maxHeight: '140px' }}
        />
        <button
          onClick={handleSendClick}
          className={`m-1.5 w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
            isStreaming
              ? 'bg-orange text-white'
              : hasText
                ? 'bg-white text-black hover:opacity-90'
                : 'bg-white text-black opacity-30 pointer-events-none'
          }`}
        >
          {isStreaming ? (
            <span className="text-[13px] font-bold">■</span>
          ) : (
            <span className="text-[15px] font-bold">↑</span>
          )}
        </button>
      </div>

      {/* Footer hints */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-[11px] text-muted/40">
          ⏎ Send · ⇧⏎ New line
        </span>
        <span className="text-[11px] flex items-center gap-1.5">
          {selectedModel === 'auto' && autoRoute ? (
            <>
              <span className="text-blue/50">⬡</span>
              <span className="text-blue/50">Auto-routing on</span>
            </>
          ) : (
            <>
              <span className="text-muted/40">⬡</span>
              <span className="text-muted/40">
                {selectedModel === 'auto' ? 'qwen3:8b' : selectedModel}
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
