import { useMemo, useState, useEffect } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import csharp from 'highlight.js/lib/languages/csharp'
import cpp from 'highlight.js/lib/languages/cpp'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import type { Message } from '../store/useStore'
import { useStore } from '../store/useStore'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('cs', csharp)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', cpp)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)

const renderer = new marked.Renderer()

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  let highlighted: string
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlighted = hljs.highlight(text, { language: lang }).value
    } catch {
      highlighted = text
    }
  } else {
    try {
      highlighted = hljs.highlightAuto(text).value
    } catch {
      highlighted = text
    }
  }
  return `<pre><button class="copy-btn" onclick="(function(btn){var code=btn.nextElementSibling.innerText;navigator.clipboard.writeText(code).then(function(){btn.textContent='Copied!';btn.classList.add('copied');setTimeout(function(){btn.textContent='Copy';btn.classList.remove('copied')},1500)});})(this)">Copy</button><code class="hljs${lang ? ` language-${lang}` : ''}">${highlighted}</code></pre>`
}

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer,
})

function getModelTagColor(model?: string): string {
  if (!model) return ''
  const m = model.toLowerCase()
  if (m.includes('qwen') && m.includes('vl')) return 'bg-purple/15 text-purple'
  if (m.includes('qwen')) return 'bg-blue/15 text-blue'
  if (m.includes('deepseek')) return 'bg-orange/15 text-orange'
  if (m.includes('gemma')) return 'bg-green/15 text-green'
  return 'bg-surface2 text-muted'
}

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
  stagger?: boolean
}

export function MessageBubble({ message, isStreaming, stagger }: MessageBubbleProps) {
  const showModelTags = useStore((s) => s.settings.showModelTags)
  const isUser = message.role === 'user'

  const htmlContent = useMemo(() => {
    if (isUser) return null
    if (!message.content) return ''
    return marked.parse(message.content) as string
  }, [message.content, isUser])

  return (
    <div
      className={`flex gap-3 animate-msg-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
      style={stagger ? { animationDelay: '80ms' } : undefined}
    >
      {/* Avatar */}
      <div
        className={`w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold ${
          isUser
            ? 'bg-white text-black'
            : 'bg-surface2 text-muted/60'
        }`}
      >
        {isUser ? 'M' : 'Ae'}
      </div>

      {/* Content */}
      <div className={`min-w-0 ${isUser ? 'max-w-[640px]' : 'max-w-[800px] flex-1'}`}>
        {/* Meta row */}
        <div
          className={`flex items-center gap-2 mb-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[11.5px] font-medium text-muted/70">
            {isUser ? 'You' : 'Aether'}
          </span>
          {!isUser && showModelTags && message.model && (
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[5px] ${getModelTagColor(
                message.model
              )}`}
            >
              {message.model}
            </span>
          )}
        </div>

        {/* Bubble / Content */}
        {isUser ? (
          <div className="bg-surface2 rounded-[14px_4px_14px_14px] px-3.5 py-2.5">
            <p className="text-[14px] text-text whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        ) : (
          <div>
            {!message.content && isStreaming ? (
              <ThinkingIndicator />
            ) : (
              <div className="relative">
                {message.thinkingSeconds != null && (
                  <span className="text-[11px] text-muted/25 mb-2 block">
                    Thought for {message.thinkingSeconds}s
                  </span>
                )}
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: htmlContent ?? '' }}
                />
                {isStreaming && <span className="typing-cursor" />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ThinkingIndicator() {
  const [seconds, setSeconds] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 500)
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      clearTimeout(showTimer)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="thinking-text">Thinking</span>
      {visible && (
        <span className="text-[13px] text-muted/40 tabular-nums">
          · {seconds}s
        </span>
      )}
    </div>
  )
}
