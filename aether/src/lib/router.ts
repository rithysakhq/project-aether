const CODE_KEYWORDS = [
  'code', 'debug', 'function', 'class', 'implement', 'script',
  'javascript', 'typescript', 'python', 'c#', 'react', 'css',
  'html', 'sql', 'error', 'bug', 'fix', 'build', 'compile',
  'syntax', 'algorithm', 'refactor', 'component', 'api', 'loop',
  'array', 'object',
]

const REASONING_KEYWORDS = [
  'why', 'analyze', 'analyse', 'compare', 'difference between',
  'explain', 'reason', 'pros and cons', 'evaluate', 'review',
  'assess', 'should i', 'what if', 'tradeoff', 'vs',
  'think through', 'walk me through',
]

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some((kw) => lower.includes(kw))
}

export function autoRoute(message: string): { model: string; label: string } {
  if (matchesKeywords(message, CODE_KEYWORDS)) {
    return { model: 'qwen2.5-coder:3b', label: 'Code [Coding] → qwen2.5-coder:3b' }
  }
  if (matchesKeywords(message, REASONING_KEYWORDS)) {
    return { model: 'phi4-mini', label: 'Reasoning [Smart] → phi4-mini' }
  }
  if (message.trim().length < 60) {
    return { model: 'gemma3:1b', label: 'Quick [Flash] → gemma3:1b' }
  }
  return { model: 'llama3.2:3b', label: 'General [Fast] → llama3.2:3b' }
}
