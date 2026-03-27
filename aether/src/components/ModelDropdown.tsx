import { useStore } from '../store/useStore'
import type { OllamaModel } from '../lib/ollama'

function getModelColor(name: string): { bg: string; text: string } {
  const n = name.toLowerCase()
  if (n.includes('qwen')) return { bg: 'bg-blue/15', text: 'text-blue' }
  if (n.includes('deepseek')) return { bg: 'bg-orange/15', text: 'text-orange' }
  if (n.includes('gemma')) return { bg: 'bg-green/15', text: 'text-green' }
  return { bg: 'bg-surface2', text: 'text-muted' }
}

function getModelInitial(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('qwen')) return 'Qw'
  if (n.includes('deepseek')) return 'Ds'
  if (n.includes('gemma')) return 'Gm'
  return name.slice(0, 2).toUpperCase()
}

function formatSize(bytes: number): string {
  const gb = bytes / 1e9
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1e6).toFixed(0)} MB`
}

interface ModelDropdownProps {
  onClose: () => void
}

export function ModelDropdown({ onClose }: ModelDropdownProps) {
  const models = useStore((s) => s.models)
  const selectedModel = useStore((s) => s.selectedModel)
  const setSelectedModel = useStore((s) => s.setSelectedModel)

  const handleSelect = (model: string) => {
    setSelectedModel(model)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-1 z-50 w-[248px] bg-[#181818] rounded-[12px] shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] animate-dropdown-in overflow-hidden">
        {/* Auto mode */}
        <div className="px-3 pt-2.5 pb-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/40">
            Mode
          </span>
        </div>
        <DropdownItem
          icon="⬡"
          iconBg="bg-purple/15"
          iconText="text-purple"
          name="Auto"
          description="Smart routing per message"
          selected={selectedModel === 'auto'}
          onClick={() => handleSelect('auto')}
        />

        {models.length > 0 && (
          <>
            <div className="h-px bg-white/[0.04] mx-3 my-1" />
            <div className="px-3 pt-2 pb-1">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/40">
                Installed
              </span>
            </div>
            {models.map((m: OllamaModel) => {
              const color = getModelColor(m.name)
              return (
                <DropdownItem
                  key={m.name}
                  icon={getModelInitial(m.name)}
                  iconBg={color.bg}
                  iconText={color.text}
                  name={m.name}
                  description={formatSize(m.size)}
                  selected={selectedModel === m.name}
                  onClick={() => handleSelect(m.name)}
                />
              )
            })}
          </>
        )}
        <div className="h-1" />
      </div>
    </>
  )
}

function DropdownItem({
  icon,
  iconBg,
  iconText,
  name,
  description,
  selected,
  onClick,
}: {
  icon: string
  iconBg: string
  iconText: string
  name: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.04] transition-colors duration-100 text-left"
    >
      <div
        className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${iconBg} ${iconText}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text truncate">{name}</div>
        <div className="text-[11px] text-muted truncate">{description}</div>
      </div>
      {selected && <span className="text-green text-[15px] flex-shrink-0">✓</span>}
    </button>
  )
}
