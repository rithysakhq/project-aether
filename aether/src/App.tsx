import { useEffect, useState, useRef, useCallback } from 'react'
import { useStore } from './store/useStore'
import { getModels } from './lib/ollama'
import { startDrag } from './lib/drag'
import { Sidebar } from './components/Sidebar'
import { ChatView } from './views/ChatView'
import { SettingsModal } from './components/modals/SettingsModal'
import { ModelsModal } from './components/modals/ModelsModal'
import { HelpModal } from './components/modals/HelpModal'

type ModalType = 'settings' | 'models' | 'help' | null

export default function App() {
  const setModels = useStore((s) => s.setModels)
  const models = useStore((s) => s.models)
  const newThread = useStore((s) => s.newThread)
  const currentThreadId = useStore((s) => s.currentThreadId)
  const clearThread = useStore((s) => s.clearThread)
  const showToast = useStore((s) => s.showToast)
  const toast = useStore((s) => s.toast)

  const [modal, setModal] = useState<ModalType>(null)
  const [ollamaOnline, setOllamaOnline] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const fetchModels = async () => {
      const m = await getModels()
      setModels(m)
      setOllamaOnline(m.length > 0)
    }
    fetchModels()
    const interval = setInterval(fetchModels, 30000)
    return () => clearInterval(interval)
  }, [setModels])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModal(null)
        return
      }
      if (e.metaKey && e.key === 'n') {
        e.preventDefault()
        newThread()
        setTimeout(() => inputRef.current?.focus(), 50)
        return
      }
      if (e.metaKey && e.key === ',') {
        e.preventDefault()
        setModal((m) => (m === 'settings' ? null : 'settings'))
        return
      }
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        if (currentThreadId) {
          clearThread(currentThreadId)
          showToast('Chat cleared')
        }
        return
      }
      if (e.metaKey && e.key === 'l') {
        e.preventDefault()
        inputRef.current?.focus()
        return
      }
    },
    [currentThreadId, clearThread, newThread, showToast]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="relative flex h-screen w-screen bg-bg overflow-hidden">
      {/* Full-width drag region at top — handles window dragging across entire title bar area */}
      <div
        onMouseDown={startDrag}
        className="absolute top-0 left-0 right-0 h-[40px] z-30"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      />

      <Sidebar
        ollamaOnline={ollamaOnline}
        modelCount={models.length}
        onOpenModels={() => setModal('models')}
        onOpenSettings={() => setModal('settings')}
        onOpenHelp={() => setModal('help')}
      />

      <ChatView onOpenHelp={() => setModal('help')} inputRef={inputRef} />

      {modal === 'settings' && (
        <SettingsModal onClose={() => setModal(null)} />
      )}
      {modal === 'models' && (
        <ModelsModal onClose={() => setModal(null)} />
      )}
      {modal === 'help' && <HelpModal onClose={() => setModal(null)} />}

      {toast && (
        <div
          className="fixed bottom-[18px] left-1/2 z-[100] animate-toast-in pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="bg-[#1c1c1c] rounded-full px-4 py-2 text-[13px] text-text shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
