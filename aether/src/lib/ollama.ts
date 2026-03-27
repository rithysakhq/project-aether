import { fetch } from '@tauri-apps/plugin-http'

const BASE = 'http://localhost:11434'

export interface OllamaModel {
  name: string
  size: number
  modified_at: string
}

interface TagsResponse {
  models: OllamaModel[]
}

export async function getModels(): Promise<OllamaModel[]> {
  try {
    const res = await fetch(`${BASE}/api/tags`)
    if (!res.ok) return []
    const data: TagsResponse = await res.json()
    return data.models ?? []
  } catch {
    return []
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/tags`)
    return res.ok
  } catch {
    return false
  }
}

export async function* streamChat(
  model: string,
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: {
        num_ctx: 2048,
        num_predict: -1,
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
        repeat_penalty: 1.1,
      },
    }),
    signal,
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`ollama:${res.status}:${errBody}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const json = JSON.parse(line)
        if (json.message?.content) {
          yield json.message.content
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  // Process remaining buffer
  if (buffer.trim()) {
    try {
      const json = JSON.parse(buffer)
      if (json.message?.content) {
        yield json.message.content
      }
    } catch {
      // skip
    }
  }
}
