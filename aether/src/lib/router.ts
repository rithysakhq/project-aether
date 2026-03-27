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
    return { model: 'qwen3:8b', label: 'Code → qwen3:8b' }
  }
  if (matchesKeywords(message, REASONING_KEYWORDS)) {
    return { model: 'deepseek-r1:8b', label: 'Reasoning → deepseek-r1:8b' }
  }
  if (message.trim().length < 60) {
    return { model: 'qwen3:4b', label: 'Quick → qwen3:4b' }
  }
  return { model: 'qwen3:8b', label: 'General → qwen3:8b' }
}
