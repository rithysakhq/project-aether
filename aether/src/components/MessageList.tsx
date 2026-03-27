import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { MessageBubble } from './MessageBubble'
import { EmptyState } from './EmptyState'

interface MessageListProps {
  onSuggestion: (text: string) => void
  routeNotice: string | null
  routeNoticeAfterIndex: number | null
}

export function MessageList({ onSuggestion, routeNotice, routeNoticeAfterIndex }: MessageListProps) {
  const threads = useStore((s) => s.threads)
  const currentThreadId = useStore((s) => s.currentThreadId)
  const isStreaming = useStore((s) => s.isStreaming)
  const showRouteNotices = useStore((s) => s.settings.showRouteNotices)

  const thread = threads.find((t) => t.id === currentThreadId)
  const messages = thread?.messages ?? []
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, messages.length > 0 ? messages[messages.length - 1]?.content : ''])

  if (!currentThreadId || messages.length === 0) {
    return <EmptyState onSuggestion={onSuggestion} />
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-7">
      <div className="flex flex-col gap-[22px] max-w-[900px] mx-auto">
        {messages.map((msg, i) => (
          <div key={msg.id}>
            {/* Route notice between user message and assistant response */}
            {showRouteNotices &&
              routeNotice &&
              routeNoticeAfterIndex === i &&
              msg.role === 'user' && (
                <div className="flex items-center gap-2 py-2 animate-fade-in">
                  <span className="w-[5px] h-[5px] rounded-full bg-blue flex-shrink-0" />
                  <span className="text-[11.5px] text-dim">{routeNotice}</span>
                </div>
              )}
            <MessageBubble
              message={msg}
              isStreaming={
                isStreaming && i === messages.length - 1 && msg.role === 'assistant'
              }
              stagger={msg.role === 'assistant' && i > 0}
            />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
