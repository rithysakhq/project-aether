import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { testConnection } from '../../lib/ollama'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const settings = useStore((s) => s.settings)
  const updateSetting = useStore((s) => s.updateSetting)
  const clearAllThreads = useStore((s) => s.clearAllThreads)
  const showToast = useStore((s) => s.showToast)
  const [connStatus, setConnStatus] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const handleTest = async () => {
    setTesting(true)
    const ok = await testConnection()
    setConnStatus(ok ? 'connected' : 'offline')
    setTesting(false)
  }

  const handleClear = () => {
    if (window.confirm('Clear all chat history? This cannot be undone.')) {
      clearAllThreads()
      showToast('All history cleared')
    }
  }

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
            <h2 className="text-[15px] font-semibold text-text">Settings</h2>
            <button
              onClick={onClose}
              className="text-muted/50 hover:text-muted transition-colors text-[16px] w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white/[0.04]"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-6">
            <Section label="Intelligence">
              <Toggle
                label="Auto-routing"
                description="Pick the best model per message automatically"
                value={settings.autoRoute}
                onChange={(v) => updateSetting('autoRoute', v)}
              />
              <Toggle
                label="Streaming responses"
                description="Show text as it generates in real time"
                value={settings.streaming}
                onChange={(v) => updateSetting('streaming', v)}
              />
            </Section>

            <Section label="Display">
              <Toggle
                label="Show model tags"
                description="Display which model replied to each message"
                value={settings.showModelTags}
                onChange={(v) => updateSetting('showModelTags', v)}
              />
              <Toggle
                label="Show routing notices"
                description="Notify when auto-routing selects a model"
                value={settings.showRouteNotices}
                onChange={(v) => updateSetting('showRouteNotices', v)}
              />
            </Section>

            <Section label="Connection">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-text">Ollama endpoint</div>
                  <div className="text-[12px] font-mono text-muted/60 mt-0.5">
                    localhost:11434
                  </div>
                  {connStatus && (
                    <div
                      className={`text-[11.5px] mt-1 flex items-center gap-1.5 ${
                        connStatus === 'connected' ? 'text-green' : 'text-orange'
                      }`}
                    >
                      <span className="w-[5px] h-[5px] rounded-full bg-current" />
                      {connStatus === 'connected'
                        ? 'Connected'
                        : 'Not reachable — run: ollama serve'}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="px-3 py-1.5 rounded-[8px] bg-white/[0.04] text-[12px] text-muted hover:text-text hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                >
                  {testing ? '...' : 'Test'}
                </button>
              </div>
            </Section>

            <Section label="Data">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-text">Clear all history</div>
                  <div className="text-[11.5px] text-muted/60 mt-0.5">
                    Remove all conversations permanently
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-[8px] bg-orange/8 text-[12px] text-orange hover:bg-orange/15 transition-colors"
                >
                  Clear
                </button>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/40 mb-3">
        {label}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[13px] text-text">{label}</div>
        <div className="text-[11.5px] text-muted/60 mt-0.5">{description}</div>
      </div>
      <div
        className={`toggle-track ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
      >
        <div className="toggle-knob" />
      </div>
    </div>
  )
}
