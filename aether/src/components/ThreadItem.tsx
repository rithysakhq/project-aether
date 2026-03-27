import type { Thread } from '../store/useStore'

function getModelDotColor(model: string): string {
  const m = model.toLowerCase()
  if (m.includes('qwen')) return 'bg-blue'
  if (m.includes('deepseek')) return 'bg-orange'
  if (m.includes('gemma')) return 'bg-green'
  return 'bg-muted/50'
}

interface ThreadItemProps {
  thread: Thread
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export function ThreadItem({ thread, isActive, onSelect, onDelete }: ThreadItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] cursor-pointer transition-all duration-150 ${
        isActive ? 'bg-surface2 text-text' : 'text-muted hover:text-text/80 hover:bg-white/[0.03]'
      }`}
    >
      <span
        className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${getModelDotColor(
          thread.model
        )}`}
      />
      <span className="text-[13px] truncate flex-1">{thread.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute right-2 opacity-0 group-hover:opacity-100 text-muted hover:text-orange transition-all duration-150 text-[12px] p-0.5"
      >
        ✕
      </button>
    </div>
  )
}
