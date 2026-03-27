import { useState, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { streamChat } from '../lib/ollama'
import { autoRoute as runAutoRoute } from '../lib/router'
import { ChatHeader } from '../components/ChatHeader'
import { ModelDropdown } from '../components/ModelDropdown'
import { MessageList } from '../components/MessageList'
import { InputBar } from '../components/InputBar'

interface ChatViewProps {
  onOpenHelp: () => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

export function ChatView({ onOpenHelp, inputRef }: ChatViewProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [routeNotice, setRouteNotice] = useState<string | null>(null)
  const [routeNoticeIndex, setRouteNoticeIndex] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const {
    currentThreadId,
    selectedModel,
    settings,
    isStreaming,
    newThread,
    addMessage,
    updateLastMessage,
    setLastMessageModel,
    setTitle,
    setStreaming,
    clearThread,
    showToast,
  } = useStore()

  const handleClearChat = useCallback(() => {
    if (currentThreadId) {
      clearThread(currentThreadId)
      showToast('Chat cleared')
    }
  }, [currentThreadId, clearThread, showToast])

  const handleSend = useCallback(
    async (text: string) => {
      if (isStreaming) return

      let threadId = currentThreadId
      if (!threadId) {
        threadId = newThread()
      }

      // Determine model
      let model: string
      let label: string | null = null

      if (selectedModel === 'auto' && settings.autoRoute) {
        const route = runAutoRoute(text)
        model = route.model
        label = route.label
      } else if (selectedModel === 'auto') {
        model = 'qwen3:8b'
      } else {
        model = selectedModel
      }

      // Add user message
      addMessage(threadId, { role: 'user', content: text })

      // Update title if still "New Chat"
      const thread = useStore.getState().threads.find((t) => t.id === threadId)
      if (thread && thread.title === 'New Chat') {
        let title = text
        if (text.length > 44) {
          const truncated = text.slice(0, 44)
          const lastSpace = truncated.lastIndexOf(' ')
          title = (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + '...'
        }
        setTitle(threadId, title)
      }

      // Set route notice
      if (label && settings.showRouteNotices) {
        const currentThread = useStore.getState().threads.find((t) => t.id === threadId)
        const msgIndex = (currentThread?.messages.length ?? 1) - 1
        setRouteNotice(label)
        setRouteNoticeIndex(msgIndex)
      } else {
        setRouteNotice(null)
        setRouteNoticeIndex(null)
      }

      // Add empty assistant message
      addMessage(threadId, { role: 'assistant', content: '' })
      setStreaming(true)

      // Stream
      const abortController = new AbortController()
      abortRef.current = abortController

      try {
        const currentThread = useStore.getState().threads.find((t) => t.id === threadId)
        const chatMessages = (currentThread?.messages ?? [])
          .filter((m) => m.content) // skip empty placeholder
          .map((m) => ({ role: m.role, content: m.content }))

        let accumulated = ''

        for await (const chunk of streamChat(model, chatMessages, abortController.signal)) {
          if (!useStore.getState().isStreaming) break
          accumulated += chunk
          updateLastMessage(threadId, accumulated)
        }

        setLastMessageModel(threadId, model)
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // User stopped
        } else {
          updateLastMessage(
            threadId,
            "Couldn't reach Ollama. Make sure it's running: `ollama serve`"
          )
        }
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [
      isStreaming,
      currentThreadId,
      selectedModel,
      settings,
      newThread,
      addMessage,
      updateLastMessage,
      setLastMessageModel,
      setTitle,
      setStreaming,
    ]
  )

  const handleSuggestion = useCallback(
    (text: string) => {
      handleSend(text)
    },
    [handleSend]
  )

  return (
    <div className="flex-1 flex flex-col h-full bg-bg relative">
      <div className="relative">
        <ChatHeader
          onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
          onClearChat={handleClearChat}
          onOpenHelp={onOpenHelp}
        />
        {dropdownOpen && (
          <div className="absolute left-5 top-full z-50">
            <ModelDropdown onClose={() => setDropdownOpen(false)} />
          </div>
        )}
      </div>

      <MessageList
        onSuggestion={handleSuggestion}
        routeNotice={routeNotice}
        routeNoticeAfterIndex={routeNoticeIndex}
      />

      <InputBar onSend={handleSend} inputRef={inputRef} />
    </div>
  )
}
