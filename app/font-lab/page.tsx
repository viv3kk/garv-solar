'use client'

import { useEffect, useMemo, useState } from 'react'
import { Nav, Footer } from '../_shared'

// ─── Curated font lists ──────────────────────────────────────────────────────
type FontDef = { name: string; weights: string; family: string }

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
  { name: 'Tinos',               family: 'Tinos',               weights: '400;700' },
  { name: 'Libre Caslon Text',   family: 'Libre Caslon Text',   weights: '400;700' },
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
  { name: 'IBM Plex Mono',    family: 'IBM Plex Mono',    weights: '400;500' },
  { name: 'JetBrains Mono',   family: 'JetBrains Mono',   weights: '400;500' },
  { name: 'Geist Mono',       family: 'Geist Mono',       weights: '400;500' },
  { name: 'Fira Code',        family: 'Fira Code',        weights: '400;500' },
  { name: 'Space Mono',       family: 'Space Mono',       weights: '400;700' },
  { name: 'DM Mono',          family: 'DM Mono',          weights: '400;500' },
  { name: 'Roboto Mono',      family: 'Roboto Mono',      weights: '400;500' },
]

// Pre-curated pairings that tend to work well together
const CURATED_PAIRS: { name: string; display: string; body: string; mono: string }[] = [
  { name: 'Current site',         display: 'Newsreader',         body: 'IBM Plex Sans',    mono: 'IBM Plex Mono' },
  { name: 'Editorial',            display: 'Playfair Display',   body: 'Inter',            mono: 'IBM Plex Mono' },
  { name: 'Cinematic',            display: 'Fraunces',           body: 'Manrope',          mono: 'JetBrains Mono' },
  { name: 'Soft Luxury',          display: 'Cormorant Garamond', body: 'Manrope',          mono: 'DM Mono' },
  { name: 'Magazine',             display: 'DM Serif Display',   body: 'DM Sans',          mono: 'DM Mono' },
  { name: 'Modern Tech',          display: 'Instrument Serif',   body: 'Instrument Sans',  mono: 'JetBrains Mono' },
  { name: 'Classic Print',        display: 'EB Garamond',        body: 'Work Sans',        mono: 'IBM Plex Mono' },
  { name: 'Warm & Refined',       display: 'Lora',               body: 'Source Sans 3',    mono: 'IBM Plex Mono' },
  { name: 'Y2K Hot',              display: 'Syne',               body: 'Plus Jakarta Sans', mono: 'Space Mono' },
  { name: 'Brand-y Bold',         display: 'Bricolage Grotesque', body: 'Outfit',          mono: 'Geist Mono' },
  { name: 'Vercel-esque',         display: 'Space Grotesk',      body: 'Geist',            mono: 'Geist Mono' },
]

// ─── Google Fonts loader ─────────────────────────────────────────────────────
function ensureGoogleFont(family: string, weights: string) {
  if (typeof document === 'undefined') return
  const slug = family.replace(/\s/g, '-')
  const id = `gfont-${slug}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s/g, '+')}:wght@${weights}&display=swap`
  document.head.appendChild(link)
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function FontLabPage() {
  const [display, setDisplay] = useState('Newsreader')
  const [body, setBody] = useState('IBM Plex Sans')
  const [mono, setMono] = useState('IBM Plex Mono')

  // Load whichever fonts the user picks
  useEffect(() => {
    const d = DISPLAY_FONTS.find((f) => f.name === display)
    const b = BODY_FONTS.find((f) => f.name === body)
    const m = MONO_FONTS.find((f) => f.name === mono)
    if (d) ensureGoogleFont(d.family, d.weights)
    if (b) ensureGoogleFont(b.family, b.weights)
    if (m) ensureGoogleFont(m.family, m.weights)
  }, [display, body, mono])

  const cssVars = useMemo<React.CSSProperties>(
    () => ({
      ['--lab-display' as string]: `'${display}', 'Newsreader', serif`,
      ['--lab-body' as string]: `'${body}', 'IBM Plex Sans', sans-serif`,
      ['--lab-mono' as string]: `'${mono}', 'IBM Plex Mono', monospace`,
    }),
    [display, body, mono]
  )

  const applyPair = (p: typeof CURATED_PAIRS[number]) => {
    setDisplay(p.display)
    setBody(p.body)
    setMono(p.mono)
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 96, background: 'var(--bg-warm)', minHeight: '100svh' }}>
        <section className="section-pad" style={{ paddingBlock: 'clamp(24px, 4vw, 56px)' }}>
          <div className="container-site" style={cssVars}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
              <div>
                <p className="eyebrow" style={{ color: 'var(--ochre-deep)' }}>Internal · Typography lab</p>
                <h1 className="h-section" style={{ marginTop: 8, fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
                  Font pairing playground.
                </h1>
              </div>
              <a href="/" className="btn btn-ghost" style={{ padding: '10px 18px' }}>← Back to site</a>
            </div>

            {/* Curated pairing chips */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
                Curated pairings
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CURATED_PAIRS.map((p) => {
                  const active = display === p.display && body === p.body && mono === p.mono
                  return (
                    <button
                      key={p.name}
                      onClick={() => applyPair(p)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        border: '1px solid',
                        borderColor: active ? 'var(--ink)' : 'var(--rule)',
                        background: active ? 'var(--ink)' : 'transparent',
                        color: active ? 'var(--bg)' : 'var(--ink-soft)',
                        fontFamily: 'IBM Plex Sans, sans-serif',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}
                    >
                      {p.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Manual pickers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 32,
              }}
              className="max-md:grid-cols-1"
            >
              <Picker label="Display (serif / headlines)" value={display} options={DISPLAY_FONTS} onChange={setDisplay} />
              <Picker label="Body (sans-serif / paragraphs)" value={body} options={BODY_FONTS} onChange={setBody} />
              <Picker label="Mono (labels / eyebrow)" value={mono} options={MONO_FONTS} onChange={setMono} />
            </div>

            {/* Preview area — sample of the site's typographic system */}
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--rule)',
                borderRadius: 20,
                padding: 'clamp(28px, 4vw, 56px)',
                ...cssVars,
              }}
            >
              {/* Display headline */}
              <p style={{ fontFamily: 'var(--lab-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
                Step into the sun
              </p>
              <h2
                style={{
                  fontFamily: 'var(--lab-display)',
                  fontSize: 'clamp(40px, 6vw, 84px)',
                  lineHeight: 1.04,
                  letterSpacing: '-0.022em',
                  marginTop: 12,
                  marginBottom: 16,
                  color: 'var(--ink)',
                  fontWeight: 400,
                }}
              >
                More than sunlight.<br />
                It&rsquo;s your <em style={{ color: 'var(--ochre-deep)' }}>peace of mind.</em>
              </h2>

              {/* Lede / body */}
              <p
                style={{
                  fontFamily: 'var(--lab-body)',
                  fontSize: 18,
                  lineHeight: 1.55,
                  color: 'var(--ink-soft)',
                  maxWidth: 540,
                  fontWeight: 300,
                  marginBottom: 24,
                }}
              >
                Clean energy. Lower bills. Energy independence. A smarter investment for your family
                and a better tomorrow for generations to come.
              </p>

              {/* Mock buttons */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    padding: '12px 22px',
                    background: 'var(--ink)',
                    color: 'var(--bg)',
                    borderRadius: 999,
                    fontFamily: 'var(--lab-mono)',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  Book a free visit →
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    padding: '12px 22px',
                    background: 'transparent',
                    color: 'var(--ink)',
                    border: '1px solid var(--ink)',
                    borderRadius: 999,
                    fontFamily: 'var(--lab-mono)',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  Estimate my savings
                </span>
              </div>

              {/* Big number — calculator hero echo */}
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 28, marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: 'var(--lab-mono)',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    marginBottom: 6,
                  }}
                >
                  Every month back in your pocket
                </p>
                <p
                  style={{
                    fontFamily: 'var(--lab-display)',
                    fontSize: 'clamp(64px, 9vw, 120px)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.025em',
                    color: 'var(--leaf-deep)',
                    fontWeight: 500,
                  }}
                >
                  ₹7,304
                </p>
                <p style={{ fontFamily: 'var(--lab-body)', fontSize: 14, color: 'var(--ink-soft)', marginTop: 6 }}>
                  A <strong style={{ color: 'var(--ink)' }}>6.9 kWp</strong> system in Rajasthan
                </p>
              </div>

              {/* Mini stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="max-md:grid-cols-1">
                {[
                  { label: 'Payback', value: '3.7 yrs' },
                  { label: '25-year savings', value: '₹15.4 L' },
                  { label: 'Trees-equivalent', value: '4,272' },
                ].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontFamily: 'var(--lab-display)', fontSize: 26, lineHeight: 1.1, color: 'var(--ink)' }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--lab-body)', fontSize: 13, color: 'var(--ink-mute)', marginTop: 4 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Paragraph + quote — long-form readability check */}
              <div style={{ borderTop: '1px solid var(--rule)', marginTop: 36, paddingTop: 28 }}>
                <p style={{ fontFamily: 'var(--lab-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', maxWidth: 640, marginBottom: 20 }}>
                  Rooftop solar is no longer a science experiment — it's a quietly competitive asset class.
                  With Tier-1 modules under a 25-year linear-performance warranty and the PM Surya Ghar subsidy
                  shaving roughly forty per cent off the headline price, the breakeven for a typical Indian
                  household now lands inside four years.
                </p>
                <blockquote
                  style={{
                    fontFamily: 'var(--lab-display)',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.4,
                    color: 'var(--ink)',
                    borderLeft: '3px solid var(--ochre)',
                    paddingLeft: 16,
                    margin: '0 0 20px',
                  }}
                >
                  "Bill dropped from ₹4,800 to ₹360 in the first month. Two summers later, the app still shows
                  steady generation."
                </blockquote>
                <p style={{ fontFamily: 'var(--lab-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-mute)' }}>
                  RAJEEV &amp; SUNITA SHARMA · INDORE · 3 KW SYSTEM
                </p>
              </div>
            </div>

            {/* Selected combo summary footer */}
            <div
              style={{
                marginTop: 24,
                padding: '14px 18px',
                background: 'var(--bg)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 18,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 11.5,
                color: 'var(--ink-soft)',
                letterSpacing: '0.04em',
              }}
            >
              <span>display: <strong style={{ color: 'var(--ink)' }}>{display}</strong></span>
              <span>body: <strong style={{ color: 'var(--ink)' }}>{body}</strong></span>
              <span>mono: <strong style={{ color: 'var(--ink)' }}>{mono}</strong></span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// ─── Picker ──────────────────────────────────────────────────────────────────
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
    <div>
      <label
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div className="calc-select" style={{ width: '100%' }}>
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
        <svg className="calc-select__chevron" width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
          <path d="M3 5.5 L7 9.5 L11 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
