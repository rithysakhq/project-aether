import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OllamaModel } from '../lib/ollama'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  thinkingSeconds?: number
  ts: number
}

export interface Thread {
  id: string
  title: string
  messages: Message[]
  model: string
  ts: number
}

export interface Settings {
  autoRoute: boolean
  streaming: boolean
  showModelTags: boolean
  showRouteNotices: boolean
}

interface Store {
  threads: Thread[]
  currentThreadId: string | null
  selectedModel: string
  models: OllamaModel[]
  isStreaming: boolean
  settings: Settings
  toast: string | null
  toastTimeout: ReturnType<typeof setTimeout> | null

  newThread: () => string
  switchThread: (id: string) => void
  deleteThread: (id: string) => void
  addMessage: (threadId: string, msg: Omit<Message, 'id' | 'ts'>) => void
  updateLastMessage: (threadId: string, content: string) => void
  setLastMessageModel: (threadId: string, model: string) => void
  setMessageThinkingSeconds: (threadId: string, msgId: string, secs: number) => void
  setTitle: (threadId: string, title: string) => void
  setSelectedModel: (model: string) => void
  setModels: (models: OllamaModel[]) => void
  setStreaming: (val: boolean) => void
  updateSetting: <K extends keyof Settings>(key: K, val: Settings[K]) => void
  clearThread: (threadId: string) => void
  clearAllThreads: () => void
  showToast: (message: string) => void
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      threads: [],
      currentThreadId: null,
      selectedModel: 'auto',
      models: [],
      isStreaming: false,
      settings: {
        autoRoute: true,
        streaming: true,
        showModelTags: true,
        showRouteNotices: true,
      },
      toast: null,
      toastTimeout: null,

      newThread: () => {
        const id = uid()
        const thread: Thread = {
          id,
          title: 'New Chat',
          messages: [],
          model: get().selectedModel,
          ts: Date.now(),
        }
        set((s) => ({
          threads: [thread, ...s.threads],
          currentThreadId: id,
        }))
        return id
      },

      switchThread: (id) => set({ currentThreadId: id }),

      deleteThread: (id) =>
        set((s) => {
          const threads = s.threads.filter((t) => t.id !== id)
          const currentThreadId =
            s.currentThreadId === id
              ? threads[0]?.id ?? null
              : s.currentThreadId
          return { threads, currentThreadId }
        }),

      addMessage: (threadId, msg) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  messages: [...t.messages, { ...msg, id: uid(), ts: Date.now() }],
                  ts: Date.now(),
                }
              : t
          ),
        })),

      updateLastMessage: (threadId, content) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId && t.messages.length > 0
              ? {
                  ...t,
                  messages: t.messages.map((m, i) =>
                    i === t.messages.length - 1 ? { ...m, content } : m
                  ),
                }
              : t
          ),
        })),

      setLastMessageModel: (threadId, model) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId && t.messages.length > 0
              ? {
                  ...t,
                  messages: t.messages.map((m, i) =>
                    i === t.messages.length - 1 ? { ...m, model } : m
                  ),
                }
              : t
          ),
        })),

      setMessageThinkingSeconds: (threadId, msgId, secs) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === msgId ? { ...m, thinkingSeconds: secs } : m
                  ),
                }
              : t
          ),
        })),

      setTitle: (threadId, title) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId ? { ...t, title } : t
          ),
        })),

      setSelectedModel: (model) => set({ selectedModel: model }),

      setModels: (models) => set({ models }),

      setStreaming: (val) => set({ isStreaming: val }),

      updateSetting: (key, val) =>
        set((s) => ({
          settings: { ...s.settings, [key]: val },
        })),

      clearThread: (threadId) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId ? { ...t, messages: [], title: 'New Chat' } : t
          ),
        })),

      clearAllThreads: () => set({ threads: [], currentThreadId: null }),

      showToast: (message) => {
        const prev = get().toastTimeout
        if (prev) clearTimeout(prev)
        const timeout = setTimeout(() => {
          set({ toast: null, toastTimeout: null })
        }, 2200)
        set({ toast: message, toastTimeout: timeout })
      },
    }),
    {
      name: 'aether-store',
      partialize: (state) => ({
        threads: state.threads,
        selectedModel: state.selectedModel,
        settings: state.settings,
      }),
    }
  )
)
