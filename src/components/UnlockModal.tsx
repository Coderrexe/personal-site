'use client'

import { useEffect, useRef, useState } from 'react'
import { useUnlock } from '@/lib/unlock'

export default function UnlockModal() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { unlocked, unlock } = useUnlock()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
        setError(false)
        setValue('')
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const submit = () => {
    const success = unlock(value)
    if (success) {
      setOpen(false)
    } else {
      setError(true)
      setValue('')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-fg/10 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-bg border border-line rounded-sm shadow-2xl w-full max-w-sm mx-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4">
          <p className="font-mono text-[0.6875rem] text-muted uppercase tracking-widest mb-3">
            {unlocked ? 'Already unlocked' : 'Enter password'}
          </p>
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Password"
            className="w-full bg-transparent text-fg text-sm outline-none placeholder:text-subtle font-mono"
          />
        </div>
        {error && (
          <div className="px-5 pb-3">
            <p className="font-mono text-xs text-red-400">Incorrect password.</p>
          </div>
        )}
        <div className="border-t border-line px-5 py-2.5 flex items-center justify-between">
          <span className="font-mono text-[0.625rem] text-subtle">↵ to confirm · esc to close</span>
          <button
            onClick={submit}
            className="font-mono text-xs text-accent hover:underline"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  )
}
