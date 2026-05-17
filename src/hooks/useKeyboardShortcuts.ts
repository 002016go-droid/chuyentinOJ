import { useEffect } from 'react'

type Handler = (e: KeyboardEvent) => void

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  if (el.closest('.monaco-editor')) return true
  return false
}

export function useShortcut(combo: string, handler: Handler, allowInInputs = false) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (!allowInInputs && isTypingTarget(e.target)) return
      if (matchCombo(e, combo)) {
        handler(e)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [combo, handler, allowInInputs])
}

function matchCombo(e: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split('+')
  const want = {
    ctrl: parts.includes('ctrl') || parts.includes('cmd'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    key: parts[parts.length - 1],
  }
  const key = e.key.toLowerCase()
  return (
    !!e.ctrlKey === want.ctrl &&
    !!e.shiftKey === want.shift &&
    !!e.altKey === want.alt &&
    key === want.key
  )
}
