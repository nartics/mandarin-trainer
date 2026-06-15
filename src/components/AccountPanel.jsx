import { useState } from 'react'
import { PrimaryButton } from './ui/common'

const STATUS = {
  idle: { label: 'Not synced', cls: 'text-ink-400 border-ink-600' },
  syncing: { label: 'Syncing…', cls: 'text-ink-300 border-ink-500 animate-pulse' },
  synced: { label: 'Synced ✓', cls: 'text-accent border-accent/40' },
  error: { label: 'Sync error', cls: 'text-cinnabar-300 border-cinnabar-500/40' },
}

export default function AccountPanel({ sync, onReset, onClose }) {
  const { configured, user, status, signIn, verifyOtp, signOut, push, lastSync } = sync
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const chip = STATUS[status] || STATUS.idle

  const send = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true); setErr(null)
    const r = await signIn(email.trim()); setBusy(false)
    if (r?.error) setErr(r.error); else setSent(true)
  }
  const verify = async (e) => {
    e.preventDefault()
    if (code.trim().length < 6) return
    setBusy(true); setErr(null)
    const r = await verifyOtp(email.trim(), code.trim()); setBusy(false)
    if (r?.error) setErr(r.error) // success → onAuthStateChange pulls + the panel re-renders signed-in
  }

  const last = lastSync?.()
  const lastLabel = last ? new Date(last).toLocaleString() : null

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-5" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Account & sync</h2>
          <button onClick={onClose} className="text-ink-400 text-xl px-1">✕</button>
        </div>

        {!configured ? (
          <p className="text-sm text-ink-300 leading-relaxed">
            Cloud sync isn't configured. Add <span className="font-mono text-ink-200">VITE_SUPABASE_URL</span> and
            <span className="font-mono text-ink-200"> VITE_SUPABASE_ANON_KEY</span> to enable it.
          </p>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink-200 truncate">{user.email}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${chip.cls}`}>{chip.label}</span>
            </div>
            {lastLabel && <p className="text-xs text-ink-500">Last synced {lastLabel}</p>}
            <PrimaryButton color="jade" onClick={push} disabled={status === 'syncing'}>Sync now</PrimaryButton>
            <button onClick={signOut} className="w-full text-sm text-ink-400 hover:text-white py-2">Sign out</button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-ink-300 leading-relaxed">
              Sign in with your email to sync progress across devices — no password, we email you a code.
            </p>
            {!sent ? (
              <form onSubmit={send} className="space-y-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
                  className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-base outline-none focus:border-ink-500" />
                <PrimaryButton color="jade" disabled={busy || !email.trim()}>{busy ? 'Sending…' : 'Send code'}</PrimaryButton>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-ink-400">Code sent to <span className="text-ink-200">{email}</span>. Enter it below.</p>
                <form onSubmit={verify} className="space-y-2">
                  <input type="text" inputMode="numeric" value={code} autoComplete="one-time-code"
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="123456" maxLength={8}
                    className="w-full px-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-center text-xl tracking-[0.4em] font-mono outline-none focus:border-ink-500" />
                  <PrimaryButton color="jade" disabled={busy || code.length < 6}>{busy ? 'Verifying…' : 'Verify code'}</PrimaryButton>
                </form>
                <button onClick={() => { setSent(false); setCode(''); setErr(null) }} className="text-xs text-ink-500 hover:text-ink-300">← Change email</button>
              </div>
            )}
            {err && <p className="text-cinnabar-300 text-xs">{/rate|limit/i.test(err) ? 'Too many attempts — wait a minute and try again.' : err}</p>}
          </div>
        )}

        {/* Reset progress */}
        <div className="mt-5 pt-4 border-t border-ink-700">
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} className="text-sm text-ink-400 hover:text-cinnabar-300 transition">
              Reset all progress
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-cinnabar-300 flex-1">Erase all progress and start from zero?</span>
              <button onClick={() => { onReset?.(); setConfirmReset(false); onClose?.() }} className="text-sm font-semibold text-cinnabar-300">Reset</button>
              <button onClick={() => setConfirmReset(false)} className="text-sm text-ink-400">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
