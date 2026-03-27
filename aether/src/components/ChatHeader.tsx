import { useStore } from '../store/useStore'
import { startDrag } from '../lib/drag'

interface ChatHeaderProps {
  onToggleDropdown: () => void
  onClearChat: () => void
  onOpenHelp: () => void
}

export function ChatHeader({
  onToggleDropdown,
  onClearChat,
  onOpenHelp,
}: ChatHeaderProps) {
  const selectedModel = useStore((s) => s.selectedModel)

  return (
    <div onMouseDown={startDrag} className="pt-[12px]">
      <div className="flex items-center justify-between px-5 py-2">
        {/* Model badge */}
        <button
          onClick={onToggleDropdown}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.04] transition-colors duration-150"
        >
          <span className="w-[6px] h-[6px] rounded-full bg-green status-dot-pulse" />
          <span className="text-[13px] font-medium text-text">
            {selectedModel === 'auto' ? 'Auto' : selectedModel}
          </span>
          {selectedModel === 'auto' && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-[5px] bg-blue/10 text-blue/80">
              AUTO
            </span>
          )}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-muted"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onClearChat}
            className="p-2 rounded-[8px] text-muted/60 hover:text-muted hover:bg-white/[0.04] transition-colors duration-150"
            title="Clear chat (⌘K)"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="16" y2="17" />
            </svg>
          </button>
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-[8px] text-muted/60 hover:text-muted hover:bg-white/[0.04] transition-colors duration-150"
            title="Help"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
