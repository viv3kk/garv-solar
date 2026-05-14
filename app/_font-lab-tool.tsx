'use client'

/**
 * Floating Font-Lab tool.
 * Mount once in app/layout.tsx — it appears on every page as a small
 * "Aa" button in the bottom-right. Open it to pick display / body / mono
 * fonts and try them live across the current page. Choices persist in
 * localStorage so they survive route changes and refreshes.
 *
 * - "Reset" restores Newsreader + IBM Plex Sans + IBM Plex Mono.
 * - "Hide tool" removes the FAB; restore by visiting any URL with ?fontlab.
 */

import { useEffect, useState } from 'react'

type FontDef = { name: string; family: string; weights: string }

const DISPLAY_FONTS: FontDef[] = [
  { name: 'Newsreader',          family: 'Newsreader',          weights: '400;500;600' },
  { name: 'Playfair Display',    family: 'Playfair Display',    weights: '400;500;700' },
  { name: 'Fraunces',            family: 'Fraunces',            weights: '400;500;600;700' },
  { name: 'Instrument Serif',    family: 'Instrument Serif',    weights: '400' },
  { name: 'DM Serif Display',    family: 'DM Serif Display',    weights: '400' },
  { name: 'Cormorant Garamond',  family: 'Cormorant Garamond',  weights: '400;500;600;700' },
  { name: 'EB Garamond',         family: 'EB Garamond',         weights: '400;500;600' },
  { name: 'Lora',                family: 'Lora',                weights: '400;500;700' },
  { name: 'Crimson Pro',         family: 'Crimson Pro',         weights: '400;500;600' },
  { name: 'Spectral',            family: 'Spectral',            weights: '400;500;600' },
  { name: 'Bricolage Grotesque', family: 'Bricolage Grotesque', weights: '400;500;700' },
  { name: 'Syne',                family: 'Syne',                weights: '400;500;700;800' },
  { name: 'Space Grotesk',       family: 'Space Grotesk',       weights: '400;500;700' },
]

const BODY_FONTS: FontDef[] = [
  { name: 'IBM Plex Sans',     family: 'IBM Plex Sans',     weights: '300;400;500;600' },
  { name: 'Inter',             family: 'Inter',             weights: '300;400;500;600' },
  { name: 'DM Sans',           family: 'DM Sans',           weights: '300;400;500;700' },
  { name: 'Manrope',           family: 'Manrope',           weights: '300;400;500;600;700' },
  { name: 'Work Sans',         family: 'Work Sans',         weights: '300;400;500;600' },
  { name: 'Source Sans 3',     family: 'Source Sans 3',     weights: '300;400;500;600' },
  { name: 'Instrument Sans',   family: 'Instrument Sans',   weights: '400;500;600' },
  { name: 'Sora',              family: 'Sora',              weights: '300;400;500;600' },
  { name: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', weights: '300;400;500;600' },
  { name: 'Outfit',            family: 'Outfit',            weights: '300;400;500;600' },
  { name: 'Geist',             family: 'Geist',             weights: '300;400;500;600' },
  { name: 'Onest',             family: 'Onest',             weights: '300;400;500;600' },
]

const MONO_FONTS: FontDef[] = [
  { name: 'IBM Plex Mono',  family: 'IBM Plex Mono',  weights: '400;500' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono', weights: '400;500' },
  { name: 'Geist Mono',     family: 'Geist Mono',     weights: '400;500' },
  { name: 'Fira Code',      family: 'Fira Code',      weights: '400;500' },
  { name: 'Space Mono',     family: 'Space Mono',     weights: '400;700' },
  { name: 'DM Mono',        family: 'DM Mono',        weights: '400;500' },
  { name: 'Roboto Mono',    family: 'Roboto Mono',    weights: '400;500' },
]

const CURATED_PAIRS: { name: string; display: string; body: string; mono: string }[] = [
  { name: 'Current site',  display: 'Newsreader',          body: 'IBM Plex Sans',     mono: 'IBM Plex Mono' },
  { name: 'Editorial',     display: 'Playfair Display',    body: 'Inter',             mono: 'IBM Plex Mono' },
  { name: 'Cinematic',     display: 'Fraunces',            body: 'Manrope',           mono: 'JetBrains Mono' },
  { name: 'Soft Luxury',   display: 'Cormorant Garamond',  body: 'Manrope',           mono: 'DM Mono' },
  { name: 'Magazine',      display: 'DM Serif Display',    body: 'DM Sans',           mono: 'DM Mono' },
  { name: 'Modern Tech',   display: 'Instrument Serif',    body: 'Instrument Sans',   mono: 'JetBrains Mono' },
  { name: 'Classic Print', display: 'EB Garamond',         body: 'Work Sans',         mono: 'IBM Plex Mono' },
  { name: 'Warm Refined',  display: 'Lora',                body: 'Source Sans 3',     mono: 'IBM Plex Mono' },
  { name: 'Y2K Hot',       display: 'Syne',                body: 'Plus Jakarta Sans', mono: 'Space Mono' },
  { name: 'Brand Bold',    display: 'Bricolage Grotesque', body: 'Outfit',            mono: 'Geist Mono' },
  { name: 'Vercel-esque',  display: 'Space Grotesk',       body: 'Geist',             mono: 'Geist Mono' },
]

const DEFAULTS = { display: 'Newsreader', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' }
const LS_FONTS = 'fontLab.fonts'
const LS_HIDDEN = 'fontLab.hidden'

function ensureGoogleFont(family: string, weights: string) {
  if (typeof document === 'undefined') return
  const id = `gfont-${family.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s/g, '+')}:wght@${weights}&display=swap`
  document.head.appendChild(link)
}

export default function FontLabTool() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [display, setDisplay] = useState(DEFAULTS.display)
  const [body, setBody] = useState(DEFAULTS.body)
  const [mono, setMono] = useState(DEFAULTS.mono)

  // First mount — restore saved fonts + visibility, honour ?fontlab override
  useEffect(() => {
    setMounted(true)
    try {
      const url = new URLSearchParams(window.location.search)
      if (url.has('fontlab')) {
        localStorage.removeItem(LS_HIDDEN)
        setHidden(false)
      } else if (localStorage.getItem(LS_HIDDEN) === '1') {
        setHidden(true)
      }
      const saved = localStorage.getItem(LS_FONTS)
      if (saved) {
        const f = JSON.parse(saved)
        if (typeof f.display === 'string') setDisplay(f.display)
        if (typeof f.body === 'string') setBody(f.body)
        if (typeof f.mono === 'string') setMono(f.mono)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Apply fonts whenever selection changes
  useEffect(() => {
    if (!mounted) return

    const d = DISPLAY_FONTS.find((f) => f.name === display)
    const b = BODY_FONTS.find((f) => f.name === body)
    const m = MONO_FONTS.find((f) => f.name === mono)
    if (d) ensureGoogleFont(d.family, d.weights)
    if (b) ensureGoogleFont(b.family, b.weights)
    if (m) ensureGoogleFont(m.family, m.weights)

    const root = document.body
    root.setAttribute('data-fontlab', 'on')
    root.style.setProperty('--font-display-lab', `'${display}', 'Newsreader', serif`)
    root.style.setProperty('--font-body-lab', `'${body}', 'IBM Plex Sans', sans-serif`)
    root.style.setProperty('--font-mono-lab', `'${mono}', 'IBM Plex Mono', monospace`)

    try {
      localStorage.setItem(LS_FONTS, JSON.stringify({ display, body, mono }))
    } catch { /* ignore */ }
  }, [display, body, mono, mounted])

  const applyPair = (p: typeof CURATED_PAIRS[number]) => {
    setDisplay(p.display)
    setBody(p.body)
    setMono(p.mono)
  }

  const reset = () => {
    setDisplay(DEFAULTS.display)
    setBody(DEFAULTS.body)
    setMono(DEFAULTS.mono)
    document.body.removeAttribute('data-fontlab')
    document.body.style.removeProperty('--font-display-lab')
    document.body.style.removeProperty('--font-body-lab')
    document.body.style.removeProperty('--font-mono-lab')
    try { localStorage.removeItem(LS_FONTS) } catch { /* ignore */ }
  }

  const hide = () => {
    try { localStorage.setItem(LS_HIDDEN, '1') } catch { /* ignore */ }
    setHidden(true)
    setOpen(false)
  }

  if (!mounted || hidden) return null

  return (
    <>
      <button
        type="button"
        className="fontlab-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close font lab' : 'Open font lab'}
        aria-expanded={open}
      >
        {open ? '×' : 'Aa'}
      </button>

      {open && (
        <div className="fontlab-panel" role="dialog" aria-label="Font lab">
          <div className="fontlab-panel__header">
            <p className="fontlab-panel__title">Font lab</p>
            <button type="button" className="fontlab-panel__close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>

          <div className="fontlab-panel__section">
            <p className="fontlab-panel__label">Curated pairings</p>
            <div className="fontlab-panel__chips">
              {CURATED_PAIRS.map((p) => {
                const active = display === p.display && body === p.body && mono === p.mono
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPair(p)}
                    className={`fontlab-chip${active ? ' is-active' : ''}`}
                  >
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="fontlab-panel__section">
            <Picker label="Display (serif / headlines)" value={display} options={DISPLAY_FONTS} onChange={setDisplay} />
            <Picker label="Body (paragraph / sans)"      value={body}    options={BODY_FONTS}    onChange={setBody} />
            <Picker label="Mono (eyebrow / labels)"      value={mono}    options={MONO_FONTS}    onChange={setMono} />
          </div>

          <div className="fontlab-panel__footer">
            <button type="button" onClick={reset} className="fontlab-btn">Reset</button>
            <button type="button" onClick={hide}  className="fontlab-btn fontlab-btn--hide">Hide tool</button>
          </div>

          <p className="fontlab-panel__hint">
            Tip: Re-show by visiting any URL with <code>?fontlab</code>.
          </p>
        </div>
      )}
    </>
  )
}

function Picker({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: FontDef[]
  onChange: (v: string) => void
}) {
  return (
    <label className="fontlab-picker">
      <span className="fontlab-picker__label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: `'${value}', system-ui, sans-serif` }}
      >
        {options.map((o) => (
          <option key={o.name} value={o.name} style={{ fontFamily: `'${o.name}', system-ui, sans-serif` }}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  )
}
