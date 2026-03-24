import { useState, useEffect, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  readonly id: number
  readonly text: string
  readonly type: ToastType
}

let addToastFn: ((text: string, type: ToastType) => void) | null = null

export function toast(text: string, type: ToastType = 'info') {
  addToastFn?.(text, type)
}

const ICON_MAP: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
}

const COLOR_MAP: Record<ToastType, string> = {
  success: 'text-green-400',
  error: 'text-nn-tertiary',
  info: 'text-nn-primary',
}

let nextId = 0

export default function ToastContainer() {
  const [toasts, setToasts] = useState<readonly ToastMessage[]>([])

  const addToast = useCallback((text: string, type: ToastType) => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => {
      addToastFn = null
    }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="nn-glass px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg animate-slide-up min-w-[280px]"
        >
          <span className={`material-symbols-outlined text-xl ${COLOR_MAP[t.type]}`}>
            {ICON_MAP[t.type]}
          </span>
          <span className="text-nn-on-surface text-sm">{t.text}</span>
        </div>
      ))}
    </div>
  )
}
