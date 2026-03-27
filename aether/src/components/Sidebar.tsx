import { useStore } from '../store/useStore'
import { startDrag } from '../lib/drag'
import { ThreadItem } from './ThreadItem'

interface SidebarProps {
  ollamaOnline: boolean
  modelCount: number
  onOpenModels: () => void
  onOpenSettings: () => void
  onOpenHelp: () => void
}

export function Sidebar({
  ollamaOnline,
  modelCount,
  onOpenModels,
  onOpenSettings,
  onOpenHelp,
}: SidebarProps) {
  const threads = useStore((s) => s.threads)
  const currentThreadId = useStore((s) => s.currentThreadId)
  const newThread = useStore((s) => s.newThread)
  const switchThread = useStore((s) => s.switchThread)
  const deleteThread = useStore((s) => s.deleteThread)

  const now = Date.now()
  const today = threads.filter((t) => now - t.ts < 86400000)
  const yesterday = threads.filter(
    (t) => now - t.ts >= 86400000 && now - t.ts < 172800000
  )
  const earlier = threads.filter((t) => now - t.ts >= 172800000)

  return (
    <div className="w-[252px] min-w-[252px] h-full bg-sidebar flex flex-col">
      {/* Header — clears macOS traffic lights */}
      <div
        className="px-5 pt-[52px] pb-3"
        onMouseDown={startDrag}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-[7px] bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-[12px] leading-none">
              Ae
            </span>
          </div>
          <div>
            <div className="text-[15px] font-semibold text-text tracking-[-0.2px]">
              Aether
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                  ollamaOnline
                    ? 'bg-green status-dot-pulse'
                    : 'bg-orange'
                }`}
              />
              <span className="text-[11px] text-muted">
                {ollamaOnline
                  ? `${modelCount} model${modelCount !== 1 ? 's' : ''} ready`
                  : 'Ollama offline'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => newThread()}
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-[7px] rounded-[8px] bg-surface2 text-[13px] text-muted hover:bg-hover hover:text-text transition-colors duration-150"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {threads.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <span className="text-[12px] text-muted/20">No conversations yet</span>
          </div>
        )}
        {today.length > 0 && (
          <ThreadGroup label="Today">
            {today.map((t) => (
              <ThreadItem
                key={t.id}
                thread={t}
                isActive={t.id === currentThreadId}
                onSelect={() => switchThread(t.id)}
                onDelete={() => deleteThread(t.id)}
              />
            ))}
          </ThreadGroup>
        )}
        {yesterday.length > 0 && (
          <ThreadGroup label="Yesterday">
            {yesterday.map((t) => (
              <ThreadItem
                key={t.id}
                thread={t}
                isActive={t.id === currentThreadId}
                onSelect={() => switchThread(t.id)}
                onDelete={() => deleteThread(t.id)}
              />
            ))}
          </ThreadGroup>
        )}
        {earlier.length > 0 && (
          <ThreadGroup label="Earlier">
            {earlier.map((t) => (
              <ThreadItem
                key={t.id}
                thread={t}
                isActive={t.id === currentThreadId}
                onSelect={() => switchThread(t.id)}
                onDelete={() => deleteThread(t.id)}
              />
            ))}
          </ThreadGroup>
        )}
      </div>

      {/* Footer */}
      <div className="flex mx-3 mb-3 rounded-[10px] bg-surface/60">
        <FooterButton label="Models" onClick={onOpenModels}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
            <circle cx="6" cy="18" r="1" fill="currentColor" />
          </svg>
        </FooterButton>
        <FooterButton label="Settings" onClick={onOpenSettings}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </FooterButton>
        <FooterButton label="Help" onClick={onOpenHelp}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </FooterButton>
      </div>
    </div>
  )
}

function ThreadGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-0.5">
      <div className="px-3 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/50">
        {label}
      </div>
      {children}
    </div>
  )
}

function FooterButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-2 text-[11px] text-muted hover:text-text transition-colors duration-150 rounded-[10px] hover:bg-hover/60"
    >
      {children}
      {label}
    </button>
  )
}
