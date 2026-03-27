import { getCurrentWindow } from '@tauri-apps/api/window'

export function startDrag(e: React.MouseEvent | MouseEvent) {
  // Only drag on left mouse button, and not on interactive elements
  if (e.button !== 0) return
  const target = e.target as HTMLElement
  if (
    target.closest('button') ||
    target.closest('input') ||
    target.closest('textarea') ||
    target.closest('a') ||
    target.closest('[data-no-drag]')
  ) {
    return
  }
  e.preventDefault()
  getCurrentWindow().startDragging()
}
