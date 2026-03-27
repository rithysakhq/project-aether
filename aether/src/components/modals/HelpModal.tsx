interface HelpModalProps {
  onClose: () => void
}

const shortcuts = [
  { keys: '⏎', desc: 'Send message' },
  { keys: '⇧⏎', desc: 'New line' },
  { keys: '⌘N', desc: 'New chat' },
  { keys: '⌘,', desc: 'Settings' },
  { keys: '⌘K', desc: 'Clear chat' },
  { keys: '⌘L', desc: 'Focus input' },
  { keys: 'Esc', desc: 'Close modal' },
]

const routingRules = [
  { pattern: 'Code keywords', model: 'qwen3:8b', color: 'bg-blue/10 text-blue' },
  { pattern: 'Reasoning keywords', model: 'deepseek-r1:8b', color: 'bg-orange/10 text-orange' },
  { pattern: 'Short messages (<60 chars)', model: 'qwen3:4b', color: 'bg-blue/10 text-blue' },
  { pattern: 'Everything else', model: 'qwen3:8b', color: 'bg-blue/10 text-blue' },
]

export function HelpModal({ onClose }: HelpModalProps) {
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
            <h2 className="text-[15px] font-semibold text-text">Help</h2>
            <button
              onClick={onClose}
              className="text-muted/50 hover:text-muted transition-colors text-[16px] w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white/[0.04]"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-6">
            {/* Keyboard Shortcuts */}
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/40 mb-3">
                Keyboard Shortcuts
              </div>
              <div className="flex flex-col">
                {shortcuts.map((s, i) => (
                  <div
                    key={s.keys}
                    className={`flex items-center justify-between py-2.5 ${
                      i < shortcuts.length - 1 ? 'border-b border-white/[0.03]' : ''
                    }`}
                  >
                    <span className="text-[13px] text-text/80">{s.desc}</span>
                    <kbd>{s.keys}</kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-routing logic */}
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/40 mb-3">
                Auto-Routing Logic
              </div>
              <div className="flex flex-col">
                <div className="flex items-center py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted/30">
                  <span className="flex-1">Pattern detected</span>
                  <span>Model assigned</span>
                </div>
                {routingRules.map((r, i) => (
                  <div
                    key={r.pattern}
                    className={`flex items-center justify-between py-2.5 ${
                      i < routingRules.length - 1 ? 'border-b border-white/[0.03]' : ''
                    }`}
                  >
                    <span className="text-[13px] text-muted/60">{r.pattern}</span>
                    <span
                      className={`text-[10.5px] font-medium px-2 py-0.5 rounded-[5px] ${r.color}`}
                    >
                      {r.model}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting started */}
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-muted/40 mb-3">
                Getting Started
              </div>
              <p className="text-[13px] text-muted/60 leading-relaxed">
                Aether requires{' '}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue/80 hover:underline"
                >
                  Ollama
                </a>{' '}
                running locally. Start it with:
              </p>
              <div className="mt-2 bg-white/[0.03] rounded-[10px] px-3.5 py-2.5">
                <code className="font-mono text-[13px] text-text/80">
                  ollama serve
                </code>
              </div>
              <p className="text-[12px] text-muted/30 mt-3">
                All conversations are stored in your browser's localStorage and
                never leave your machine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
