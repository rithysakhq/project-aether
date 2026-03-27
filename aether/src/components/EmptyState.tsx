const suggestions = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    text: 'Compare model capabilities',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    text: 'Write me some code',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    text: 'Think something through',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    text: 'Ideas to build with local AI',
  },
]

interface EmptyStateProps {
  onSuggestion: (text: string) => void
}

export function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="flex flex-col items-center max-w-[400px] w-full">
        {/* Logo mark */}
        <div className="w-[52px] h-[52px] rounded-[12px] bg-surface2 flex items-center justify-center mb-4">
          <span className="text-muted/50 text-[16px] font-semibold">Ae</span>
        </div>

        <h2 className="text-[17px] font-semibold text-muted/40 mb-1">Aether</h2>
        <p className="text-[13px] text-muted/30 mb-8">
          Local AI, entirely yours.
        </p>

        {/* Suggestion buttons */}
        <div className="flex flex-col gap-1.5 w-full max-w-[360px]">
          {suggestions.map((s) => (
            <button
              key={s.text}
              onClick={() => onSuggestion(s.text)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-[10px] text-[13px] text-muted/60 hover:text-text/80 hover:bg-white/[0.03] hover:translate-x-[2px] transition-all duration-150"
            >
              <span className="flex-shrink-0 opacity-50">{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
