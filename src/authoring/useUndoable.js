import { useCallback, useRef, useState } from 'react'

// Draft state with undo/redo. Rapid edits to the same field (same key) collapse into one step.
export default function useUndoable(initial) {
  const [st, setSt] = useState({ past: [], present: initial, future: [] })
  const last = useRef({ key: null, t: 0 })

  const set = useCallback((next, key) => {
    // Decide merging outside the updater: React may run updaters twice in development.
    const now = Date.now()
    const merge = !!key && last.current.key === key && now - last.current.t < 900
    last.current = { key, t: now }
    setSt((s) => {
      const value = typeof next === 'function' ? next(s.present) : next
      if (value === s.present) return s
      return { past: merge ? s.past : [...s.past.slice(-149), s.present], present: value, future: [] }
    })
  }, [])

  const undo = useCallback(() => setSt((s) => {
    if (!s.past.length) return s
    last.current = { key: null, t: 0 }
    return { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] }
  }), [])

  const redo = useCallback(() => setSt((s) => {
    if (!s.future.length) return s
    last.current = { key: null, t: 0 }
    return { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) }
  }), [])

  const reset = useCallback((value) => setSt({ past: [], present: value, future: [] }), [])

  return { value: st.present, set, undo, redo, reset, canUndo: st.past.length > 0, canRedo: st.future.length > 0 }
}
