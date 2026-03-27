import { useStore } from '../../store/useStore'
import type { OllamaModel } from '../../lib/ollama'

const MODEL_INFO: Record<string, string> = {
  'qwen3:8b': 'Daily driver · Code + chat',
  'qwen3:4b': 'Lightweight · Quick queries',
  'qwen3-vl:8b': 'Vision · Image + text',
  'qwen3-vl:4b': 'Vision · Lightweight',
  'deepseek-r1:8b': '[Reasoning] Deep thinking · Problem solving',
  'gemma3:4b': '[Balanced] Instruction following',
  'gemma3:1b': '[Flash] Ultra-light · One-liners',
  'llama3.2:3b': '[Fast] General chat · Daily driver',
  'llama3.2:1b': '[Flash] Fastest · Trivial tasks',
  'qwen2.5-coder:3b': '[Coding] Code, debug, tech tasks',
  'phi4-mini': '[Smart] Reasoning · Analysis',
}

function getModelColor(name: string): { bg: string; text: string; iconBg: string } {
  const n = name.toLowerCase()
  if (n.includes('qwen')) return { bg: 'bg-blue/15', text: 'text-blue', iconBg: 'bg-blue/10' }
  if (n.includes('deepseek')) return { bg: 'bg-orange/15', text: 'text-orange', iconBg: 'bg-orange/10' }
  if (n.includes('gemma')) return { bg: 'bg-green/15', text: 'text-green', iconBg: 'bg-green/10' }
  if (n.includes('llama')) return { bg: 'bg-purple/15', text: 'text-purple', iconBg: 'bg-purple/10' }
  if (n.includes('phi')) return { bg: 'bg-blue/10', text: 'text-blue/70', iconBg: 'bg-blue/08' }
  return { bg: 'bg-surface2', text: 'text-muted', iconBg: 'bg-surface2' }
}

function getModelInitial(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('qwen') && n.includes('vl')) return 'Vl'
  if (n.includes('qwen')) return 'Qw'
  if (n.includes('deepseek')) return 'Ds'
  if (n.includes('gemma')) return 'Gm'
  if (n.includes('llama')) return 'Ll'
  if (n.includes('phi')) return 'Φ'
  return name.slice(0, 2).toUpperCase()
}

function formatSize(bytes: number): string {
  const gb = bytes / 1e9
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1e6).toFixed(0)} MB`
}

interface ModelsModalProps {
  onClose: () => void
}

export function ModelsModal({ onClose }: ModelsModalProps) {
  const models = useStore((s) => s.models)
  const selectedModel = useStore((s) => s.selectedModel)

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[8px] animate-overlay-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-[480px] max-h-[80vh] overflow-y-auto bg-[#161616] rounded-[16px] shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h2 className="text-[15px] font-semibold text-text">Models</h2>
            <button
              onClick={onClose}
              className="text-muted/50 hover:text-muted transition-colors text-[16px] w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white/[0.04]"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-6">
            {models.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[13px] text-muted mb-2">
                  No models found
                </p>
                <p className="text-[11.5px] text-muted/40">
                  Make sure Ollama is running:{' '}
                  <code className="font-mono text-muted/60">ollama serve</code>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {models.map((m: OllamaModel) => {
                  const color = getModelColor(m.name)
                  const description = MODEL_INFO[m.name] ?? 'General purpose'
                  const isActive =
                    selectedModel === m.name || selectedModel === 'auto'

                  return (
                    <div
                      key={m.name}
                      className="flex items-center gap-3 p-3 rounded-[12px] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div
                        className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[13px] font-semibold flex-shrink-0 ${color.iconBg} ${color.text}`}
                      >
                        {getModelInitial(m.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold text-text truncate">
                          {m.name}
                        </div>
                        <div className="text-[11.5px] text-muted/60 truncate">
                          {description} · {formatSize(m.size)}
                        </div>
                      </div>
                      <span
                        className={`text-[10.5px] font-medium px-2 py-0.5 rounded-[6px] flex-shrink-0 ${
                          isActive
                            ? 'bg-green/10 text-green'
                            : 'text-muted/30'
                        }`}
                      >
                        {isActive ? 'Ready' : 'Idle'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
