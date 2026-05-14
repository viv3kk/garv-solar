'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Nav, Footer, Eyebrow, Reveal, Arrow } from '../_shared'
import { calculate, billToUnits } from './calc'
import {
  STATES,
  type Segment,
  type Shading,
  type Financing,
  LOAN_RATE_DEFAULT,
  LOAN_TENURE_OPTIONS,
} from './constants'

type InputMode = 'units' | 'bill'

const fmtRupees = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const fmtLakh = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : fmtRupees(n)

// ─── Smooth-tween number that animates from previous to new value ────────────
function TweenNumber({
  value,
  duration = 700,
  format,
  prefix = '',
  suffix = '',
}: {
  value: number
  duration?: number
  format?: (n: number) => string
  prefix?: string
  suffix?: string
}) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const start = prev.current
    const end = value
    if (start === end) {
      setDisplay(end)
      return
    }
    const t0 = performance.now()
    let frame: number
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(start + (end - start) * ease)
      if (t < 1) frame = requestAnimationFrame(tick)
      else prev.current = end
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])
  return (
    <>
      {prefix}
      {format ? format(display) : Math.round(display).toLocaleString('en-IN')}
      {suffix}
    </>
  )
}

// ─── Realistic sun (warm radial gradient core + dual ray sets + halo) ────────
function SunReal() {
  return (
    <svg className="calc-sun-real" viewBox="0 0 240 240" aria-hidden>
      <defs>
        <radialGradient id="sun-core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FFEFA8" />
          <stop offset="35%" stopColor="#FFC95B" />
          <stop offset="70%" stopColor="#E89A2D" />
          <stop offset="100%" stopColor="#B86A12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-halo-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#F5B442" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#F5B442" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#F5B442" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sun-ray-grad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFC95B" stopOpacity="0" />
          <stop offset="50%" stopColor="#F5B442" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E89A2D" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Outer halo */}
      <circle cx="120" cy="120" r="118" fill="url(#sun-halo-grad)" />

      {/* Long primary rays (slow rotation) */}
      <g className="calc-sun-real__rays">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="120" y1="38"
            x2="120" y2="62"
            stroke="url(#sun-ray-grad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            transform={`rotate(${i * 30} 120 120)`}
          />
        ))}
      </g>

      {/* Short secondary rays (counter rotation + pulse) */}
      <g className="calc-sun-real__rays-fast">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="120" y1="50"
            x2="120" y2="64"
            stroke="#F5B442"
            strokeOpacity="0.7"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${i * 30 + 15} 120 120)`}
          />
        ))}
      </g>

      {/* Core */}
      <g className="calc-sun-real__core">
        <circle cx="120" cy="120" r="62" fill="url(#sun-core-grad)" />
        <circle cx="120" cy="120" r="48" fill="#FFC95B" />
        <circle cx="120" cy="120" r="46" fill="#FFEFA8" opacity="0.35" />
        {/* tiny specular highlight */}
        <ellipse cx="106" cy="106" rx="10" ry="6" fill="#FFFCE8" opacity="0.6" />
      </g>
    </svg>
  )
}

// Small leaf SVG used for floating motes
function Leaf({ style, sway }: { style?: React.CSSProperties; sway?: boolean }) {
  return (
    <svg className={`calc-leaf${sway ? ' calc-leaf--sway' : ''}`} style={style} width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <path
        d="M20 4 C8 12, 8 28, 20 36 C32 28, 32 12, 20 4 Z M20 4 L20 36"
        fill="currentColor"
        fillOpacity="0.65"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Silhouette tree
function Tree({ style, size = 120, alt }: { style?: React.CSSProperties; size?: number; alt?: boolean }) {
  return (
    <svg
      className={`garden-tree${alt ? ' garden-tree--alt' : ''}`}
      style={style}
      width={size}
      height={size * 1.5}
      viewBox="0 0 100 150"
      aria-hidden
    >
      {/* trunk */}
      <rect x="46" y="92" width="8" height="56" fill="currentColor" opacity="0.85" />
      {/* canopy — layered organic blobs */}
      <circle cx="50" cy="50" r="36" fill="currentColor" opacity="0.85" />
      <circle cx="32" cy="64" r="22" fill="currentColor" opacity="0.85" />
      <circle cx="68" cy="64" r="22" fill="currentColor" opacity="0.85" />
      <circle cx="50" cy="78" r="20" fill="currentColor" opacity="0.85" />
      <circle cx="40" cy="42" r="14" fill="currentColor" opacity="0.85" />
      <circle cx="62" cy="44" r="16" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

// Flying bird (V-shape with flapping wings)
function Bird({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="garden-bird" style={style}>
      <svg width="32" height="14" viewBox="0 0 40 18" aria-hidden>
        <g className="garden-bird__wings">
          <path
            d="M2 12 Q11 2 19 11 Q27 2 38 12"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}

// Grass blade
function Grass({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className="garden-grass" style={style} width="14" height="40" viewBox="0 0 14 40" aria-hidden>
      <path d="M7 40 Q4 22 7 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Butterfly
function Butterfly({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className="garden-butterfly" style={style} width="30" height="22" viewBox="0 0 40 30" aria-hidden>
      <ellipse className="garden-butterfly__wing-l" cx="13" cy="13" rx="11" ry="9" fill="currentColor" />
      <ellipse className="garden-butterfly__wing-r" cx="27" cy="13" rx="11" ry="9" fill="currentColor" />
      <rect x="19" y="6" width="2" height="16" rx="1" fill="var(--ink)" opacity="0.6" />
    </svg>
  )
}

// Small flower (3-petal silhouette)
function Flower({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className="garden-flower" style={style} width="20" height="32" viewBox="0 0 20 32" aria-hidden>
      <path d="M10 32 L10 14" stroke="var(--leaf-deep)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="10" cy="8" r="4" fill="currentColor" />
      <circle cx="5"  cy="11" r="3" fill="currentColor" />
      <circle cx="15" cy="11" r="3" fill="currentColor" />
      <circle cx="10" cy="14" r="3" fill="currentColor" />
      <circle cx="10" cy="8" r="1.5" fill="var(--leaf-deep)" />
    </svg>
  )
}

// ─── Background variants ─────────────────────────────────────────────────────
// Background variants (controllable via ?bg=<variant> URL param):
//   'sunrise'  — warm sun, light beams, sparkles, drifting clouds
//   'flow'     — animated dashed power lines + travelling green pulses
//   'garden'   — soft sky-sun + drifting leaves and petals  (default)
type BgVariant = 'sunrise' | 'flow' | 'garden'
const BG_VARIANTS: BgVariant[] = ['sunrise', 'flow', 'garden']
const BG_DEFAULT: BgVariant = 'sunrise'

function parseBgVariant(raw: string | null): BgVariant {
  if (!raw) return BG_DEFAULT
  const normalised = raw.toLowerCase() as BgVariant
  return BG_VARIANTS.includes(normalised) ? normalised : BG_DEFAULT
}

function BackgroundSunrise() {
  return (
    <div className="calc-bg" aria-hidden>
      <SunReal />
      {/* light beams */}
      <div className="calc-beam" />
      <div className="calc-beam" />
      <div className="calc-beam" />
      {/* sparkles */}
      <div className="calc-sparkle" style={{ top: '14%', left: '52%', animationDelay: '0s' }} />
      <div className="calc-sparkle" style={{ top: '28%', left: '68%', animationDelay: '0.8s' }} />
      <div className="calc-sparkle" style={{ top: '46%', left: '46%', animationDelay: '1.4s', width: 4, height: 4 }} />
      <div className="calc-sparkle" style={{ top: '58%', left: '78%', animationDelay: '2.2s' }} />
      <div className="calc-sparkle" style={{ top: '72%', left: '58%', animationDelay: '0.4s', width: 4, height: 4 }} />
      <div className="calc-sparkle" style={{ top: '82%', left: '34%', animationDelay: '1.8s' }} />
      <div className="calc-sparkle" style={{ top: '36%', left: '22%', animationDelay: '2.8s', width: 5, height: 5 }} />
      {/* clouds */}
      <div className="calc-cloud" style={{ top: '32%', animationDelay: '-8s' }} />
      <div className="calc-cloud" style={{ top: '64%', animationDelay: '-22s', opacity: 0.5 }} />
    </div>
  )
}

function BackgroundFlow() {
  return (
    <div className="calc-bg" aria-hidden>
      <div className="calc-grid-bg" />
      <SunReal />
      {/* flowing dashed lines + travelling pulses */}
      {[18, 32, 48, 64, 78].map((top, i) => (
        <div key={top} style={{ position: 'absolute', top: `${top}%`, left: 0, right: 0 }}>
          <div className="calc-flow" />
          <div
            className="calc-flow-pulse"
            style={{
              top: 0,
              animationDelay: `${i * -1.6}s`,
              animationDuration: `${7 + i * 0.8}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function BackgroundGarden() {
  return (
    <div className="calc-bg" aria-hidden>
      {/* soft sun + horizon glow */}
      <div className="calc-sun-soft" />
      <div className="garden-horizon" />

      {/* TREES — silhouettes anchored to the bottom edge */}
      <Tree style={{ left: -16, bottom: -8 }} size={200} />
      <Tree style={{ left: '14%', bottom: -10 }} size={140} alt />
      <Tree style={{ right: -8, bottom: -8 }} size={170} />
      <Tree style={{ right: '20%', bottom: -10 }} size={110} alt />
      <Tree style={{ left: '38%', bottom: -12 }} size={90} alt />

      {/* BIRDS — flying across at different altitudes and speeds */}
      <Bird style={{ top: '14%', animationDelay: '-3s', animationDuration: '24s' }} />
      <Bird style={{ top: '22%', left: -40, animationDelay: '-12s', animationDuration: '28s', opacity: 0.35 }} />
      <Bird style={{ top: '8%', animationDelay: '-18s', animationDuration: '20s', opacity: 0.5 }} />
      <Bird style={{ top: '30%', animationDelay: '-7s', animationDuration: '26s', opacity: 0.32 }} />

      {/* BUTTERFLIES — flutter near the foreground */}
      <Butterfly style={{ top: '54%', left: '22%' }} />
      <Butterfly style={{ top: '66%', right: '28%', animationDelay: '-9s', opacity: 0.4 }} />

      {/* GRASS — short blades along the very bottom */}
      {[8, 16, 23, 30, 37, 44, 52, 60, 68, 75, 83, 90, 96].map((left, i) => (
        <Grass
          key={left}
          style={{
            left: `${left}%`,
            height: 28 + (i % 3) * 8,
            opacity: 0.18 + (i % 2) * 0.06,
            animationDelay: `${-(i * 0.4)}s`,
            animationDuration: `${4 + (i % 3) * 0.8}s`,
          }}
        />
      ))}

      {/* FLOWERS — small wild flowers along the grass line */}
      <Flower style={{ left: '12%', bottom: 4 }} />
      <Flower style={{ left: '30%', bottom: 2, opacity: 0.5 }} />
      <Flower style={{ left: '54%', bottom: 4, color: 'var(--clay)', opacity: 0.5 }} />
      <Flower style={{ right: '22%', bottom: 2, opacity: 0.55 }} />
      <Flower style={{ right: '42%', bottom: 4, color: 'var(--clay)', opacity: 0.45 }} />

      {/* drifting leaves (preserved from before) */}
      <Leaf style={{ top: '14%', left: '6%',  width: 44, height: 44, opacity: 0.22 }} />
      <Leaf style={{ top: '24%', left: '22%', width: 28, height: 28, opacity: 0.18, animationDelay: '-2s' }} sway />
      <Leaf style={{ top: '38%', left: '8%',  width: 36, height: 36, opacity: 0.20, animationDelay: '-6s' }} />
      <Leaf style={{ top: '52%', left: '18%', width: 24, height: 24, opacity: 0.16, animationDelay: '-3s' }} sway />
      <Leaf style={{ top: '12%', right: '14%', width: 32, height: 32, opacity: 0.18, animationDelay: '-4s' }} sway />
      <Leaf style={{ top: '46%', right: '8%',  width: 38, height: 38, opacity: 0.20, animationDelay: '-7s' }} />

      {/* drifting petals */}
      <div className="calc-petal" style={{ top: '6%',  left: '30%', animationDelay: '0s' }} />
      <div className="calc-petal" style={{ top: '4%',  left: '58%', animationDelay: '-4s' }} />
      <div className="calc-petal" style={{ top: '8%',  left: '74%', animationDelay: '-9s' }} />
      <div className="calc-petal" style={{ top: '2%',  left: '46%', animationDelay: '-13s' }} />
    </div>
  )
}

function CalculatorBackground({ variant }: { variant: BgVariant }) {
  if (variant === 'flow') return <BackgroundFlow />
  if (variant === 'garden') return <BackgroundGarden />
  return <BackgroundSunrise />
}

// ─── Rotating Hindi hook ─────────────────────────────────────────────────────
type Hook = { hi: string; en: string }

function getHooks(monthly: number, kW: number, paybackYrs: number, stateName: string, lifetime: number): Hook[] {
  const monthlyStr = Math.round(monthly).toLocaleString('en-IN')
  const lifetimeStr = lifetime >= 100000 ? `${(lifetime / 100000).toFixed(1)} लाख` : monthly.toLocaleString('en-IN')
  return [
    {
      hi: `वाह! हर महीने ₹${monthlyStr} सीधे आपकी जेब में।`,
      en: `Wow! ₹${monthlyStr} straight to your pocket every month.`,
    },
    {
      hi: `${paybackYrs} साल में पैसा वापस, फिर पूरी बचत!`,
      en: `Your money back in ${paybackYrs} years — after that, pure savings!`,
    },
    {
      hi: `${stateName} की धूप + ${kW} kWp की छत = ज़बरदस्त बचत।`,
      en: `${stateName}'s sunshine + a ${kW} kWp rooftop = serious savings.`,
    },
    {
      hi: `पच्चीस साल में ₹${lifetimeStr} की बचत — सिर्फ़ एक छत से!`,
      en: `₹${lifetimeStr} saved over 25 years — from one rooftop!`,
    },
    {
      hi: 'अरे वाह! ये तो धूप का जादू है।',
      en: 'Whoa! This is the magic of sunlight.',
    },
    {
      hi: 'बिल भूल जाइए, बचत याद रखिए।',
      en: 'Forget the bill, remember the savings.',
    },
    {
      hi: 'छत पे सोना, मुफ़्त की बिजली!',
      en: 'Gold on your roof — free electricity!',
    },
    {
      hi: 'गर्व ऊर्जा के साथ, बेफ़िक्र होकर सोलर।',
      en: 'With Garv Urja, go solar — and stop worrying.',
    },
    {
      hi: 'अब बिजली ख़रीदिए नहीं — बनाइए।',
      en: "Don't buy electricity anymore — make it.",
    },
    {
      hi: 'एक बार लगाइए, पच्चीस साल मुस्कुराइए।',
      en: 'Install once, smile for 25 years.',
    },
  ]
}

function HindiHook({
  monthly,
  kW,
  paybackYrs,
  stateName,
  lifetime,
  trigger,
}: {
  monthly: number
  kW: number
  paybackYrs: number
  stateName: string
  lifetime: number
  /** Stringified signature of all user inputs — rotates the hook on any change */
  trigger: string
}) {
  const hooks = useMemo(
    () => getHooks(monthly, kW, paybackYrs, stateName, lifetime),
    [monthly, kW, paybackYrs, stateName, lifetime]
  )

  const [idx, setIdx] = useState(0)
  // null on first render so we can establish the baseline without rotating
  const lastTrigger = useRef<string | null>(null)

  // Advance the hook on every input change (slider, state, segment, tab).
  // Tracking the raw input signature avoids the rounded-monthly false-stable
  // problem where two slider positions resolve to the same ₹ amount.
  useEffect(() => {
    if (lastTrigger.current === null) {
      lastTrigger.current = trigger
      return
    }
    if (trigger !== lastTrigger.current) {
      lastTrigger.current = trigger
      setIdx((i) => (i + 1) % hooks.length)
    }
  }, [trigger, hooks.length])

  const hook = hooks[Math.min(idx, hooks.length - 1)]

  return (
    <div className="hindi-hook">
      <div key={`${idx}-${hook.hi}`} className="hindi-hook__content">
        <p className="hindi-hook__hi">{hook.hi}</p>
        <p className="hindi-hook__en">{hook.en}</p>
      </div>
    </div>
  )
}

// ─── Checkmark used in pillars ───────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
      <circle cx="7" cy="7" r="6.5" fill="currentColor" opacity="0.12" />
      <path d="M4 7.2 L6.2 9.4 L10 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Chevron for the advanced-options toggle
function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden fill="none">
      <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Mini-stat icons (clock / wallet / tree) ────────────────────────────────
function ClockStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function WalletStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11a2.5 2.5 0 0 1 2.5 2.5V8" />
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M21 12.5h-3a1.5 1.5 0 0 0 0 3h3" />
    </svg>
  )
}

function TreeStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L6 11 H9 L4.5 17 H9 L12 14 L15 17 H19.5 L15 11 H18 Z" />
      <path d="M12 14 V21" />
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
function CalculatorPage() {
  // Background variant — driven by ?bg=<variant> URL param
  const searchParams = useSearchParams()
  const bgVariant = parseBgVariant(searchParams.get('bg'))

  // Essential inputs
  const [segment, setSegment] = useState<Segment>('residential')
  const [stateCode, setStateCode] = useState('RJ')
  const [inputMode, setInputMode] = useState<InputMode>('bill')
  const [monthlyUnits, setMonthlyUnits] = useState(300)
  const [monthlyBill, setMonthlyBill] = useState(3500)

  // Advanced inputs
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const advancedRef = useRef<HTMLDivElement>(null)
  const advancedEndRef = useRef<HTMLDivElement>(null)
  const advancedToggleRef = useRef<HTMLButtonElement>(null)
  /** Ref on the .calc-card (the overflow-y: auto container). Used to scroll
   *  the advanced section into view internally — without moving the window. */
  const cardRef = useRef<HTMLDivElement>(null)
  const [roofSqft, setRoofSqft] = useState(500)
  const [shading, setShading] = useState<Shading>('none')
  const [financing, setFinancing] = useState<Financing>('cash')
  const [loanTenure, setLoanTenure] = useState<number>(5)
  const [loanRate] = useState(LOAN_RATE_DEFAULT)

  // Lead-capture gate
  const [unlocked, setUnlocked] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadEmail, setLeadEmail] = useState('')

  const st = STATES[stateCode]

  const segmentTariff = st.tariff[segment]

  const effectiveUnits = useMemo(() => {
    if (inputMode === 'bill') return billToUnits(monthlyBill, segmentTariff)
    return monthlyUnits
  }, [inputMode, monthlyBill, monthlyUnits, segmentTariff])

  // Residential cannot use OPEX
  const effectiveFinancing: Financing =
    financing === 'opex' && segment === 'residential' ? 'cash' : financing

  const result = useMemo(
    () =>
      calculate({
        segment,
        stateCode,
        monthlyUnits: effectiveUnits,
        roofSqft,
        shading,
        financing: effectiveFinancing,
        loanTenureYrs: loanTenure,
        loanRate,
      }),
    [segment, stateCode, effectiveUnits, roofSqft, shading, effectiveFinancing, loanTenure, loanRate]
  )

  // Brief "bump" animation when any visible input changes
  const [bump, setBump] = useState(false)
  useEffect(() => {
    setBump(true)
    const t = setTimeout(() => setBump(false), 380)
    return () => clearTimeout(t)
  }, [monthlyBill, monthlyUnits, stateCode, segment, roofSqft])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadName || !leadPhone) return
    setUnlocked(true)
  }

  // Build a sparkline path from the 25-yr cumulative-savings projection
  const sparkline = useMemo(() => {
    const proj = result.projection
    const max = proj[proj.length - 1].cumulativeSavings || 1
    const w = 600
    const h = 100
    const stepX = w / (proj.length - 1)
    const points = proj.map((p, i) => {
      const x = i * stepX
      const y = h - (p.cumulativeSavings / max) * (h - 6) - 3
      return [x, y] as const
    })
    const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    const dFill = `${d} L${w},${h} L0,${h} Z`
    return { d, dFill, w, h, max }
  }, [result.projection])

  return (
    <>
      <Nav />
      <main>
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* HERO — calculator + huge savings number                             */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <section className="calc-hero">
          <CalculatorBackground variant={bgVariant} />

          <div className="container-site" style={{ position: 'relative', zIndex: 3 }}>
            <Reveal>
              <div style={{ textAlign: 'center', maxWidth: 720, marginInline: 'auto' }}>
                <h1
                  className="h-section"
                  style={{
                    marginTop: 0,
                    fontSize: 'clamp(24px, 2.8vw, 36px)',
                    lineHeight: 1.12,
                  }}
                >
                  In 30 seconds, see what solar will{' '}
                  <em style={{ color: 'var(--leaf-deep)', fontStyle: 'italic' }}>save you.</em>
                </h1>
              </div>
            </Reveal>

            <div className="calc-layout">
              {/* ─── LEFT: friendly input card ─── */}
              <Reveal>
                <div className="calc-card" ref={cardRef}>
                  {/* Property type — ochre pills with uppercase mono labels */}
                  <div style={{ marginBottom: 18 }}>
                    <p
                      style={{
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: 11,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-mute)',
                        marginBottom: 10,
                      }}
                    >
                      Property type
                    </p>
                    <PropertyPills
                      value={segment}
                      onChange={(v) => setSegment(v as Segment)}
                      options={[
                        { value: 'residential', label: 'Residential' },
                        { value: 'commercial', label: 'Commercial' },
                        // { value: 'industrial', label: 'Industrial' },
                      ]}
                    />
                  </div>

                  {/* All three inputs always visible, inline label: value layout */}

                  {/* State — label inline with select; tariff sits in the trigger */}
                  <div className="calc-row calc-row--inline">
                    <span className="calc-row__inline-label">Where do you live?</span>
                    <SearchableSelect
                      value={stateCode}
                      onChange={setStateCode}
                      ariaLabel="State"
                      options={Object.entries(STATES)
                        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                        .map(([code, info]) => ({
                          value: code,
                          label: info.name,
                          meta: `₹${info.tariff[segment]}/unit`,
                        }))}
                    />
                  </div>

                  {/* Bill / Units — toggle sits inline next to the slider label */}
                  <div className="calc-row">
                    {inputMode === 'bill' ? (
                      <FriendlySlider
                        label={
                          <span className="calc-inline-label">
                            <span>Monthly bill</span>
                            <ToggleSwitch
                              value={inputMode}
                              onChange={(v) => setInputMode(v as InputMode)}
                              options={[
                                { value: 'bill',  label: '₹' },
                                { value: 'units', label: 'kWh' },
                              ]}
                            />
                          </span>
                        }
                        display={fmtRupees(monthlyBill)}
                        min={500}
                        max={100000}
                        step={250}
                        value={monthlyBill}
                        onChange={setMonthlyBill}
                        bump={bump}
                        leaf
                      />
                    ) : (
                      <FriendlySlider
                        label={
                          <span className="calc-inline-label">
                            <span>Monthly units</span>
                            <ToggleSwitch
                              value={inputMode}
                              onChange={(v) => setInputMode(v as InputMode)}
                              options={[
                                { value: 'bill',  label: '₹' },
                                { value: 'units', label: 'kWh' },
                              ]}
                            />
                          </span>
                        }
                        display={`${monthlyUnits} units`}
                        min={50}
                        max={5000}
                        step={25}
                        value={monthlyUnits}
                        onChange={setMonthlyUnits}
                        bump={bump}
                        leaf
                      />
                    )}
                  </div>

                  {/* Roof area — inline label:value slider */}
                  <div className="calc-row">
                    <FriendlySlider
                      label="Rooftop space"
                      display={`${roofSqft.toLocaleString('en-IN')} sq ft`}
                      min={100}
                      max={10000}
                      step={50}
                      value={roofSqft}
                      onChange={setRoofSqft}
                      bump={bump}
                    />
                  </div>

                  {/* Advanced toggle */}
                  <button
                    type="button"
                    ref={advancedToggleRef}
                    className={`calc-advanced-toggle${advancedOpen ? ' open' : ''}`}
                    onClick={() => {
                      const opening = !advancedOpen
                      setAdvancedOpen(opening)
                      if (opening) {
                        // Internal-only scroll: nudge the .calc-card overflow
                        // container down so both "Shading on the roof" and
                        // "How would you pay" come into view. The window does
                        // NOT scroll, so the rest of the page stays put.
                        // We wait one full grid-template-rows animation cycle
                        // (the .calc-advanced expansion runs ~0.45s) so the
                        // newly revealed content has its final height.
                        const card = cardRef.current
                        if (!card) return
                        // Detect mobile (column-stack) vs desktop layout.
                        // On mobile the column-stack means .calc-card has no
                        // overflow — scroll the window instead, but only just
                        // enough to bring the advanced fields into view.
                        const mqMobile = window.matchMedia('(max-width: 900px)').matches
                        setTimeout(() => {
                          if (mqMobile) {
                            advancedRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            })
                          } else {
                            // Desktop: scroll the card to its bottom (the
                            // advanced section is the last child, so this
                            // shows Shading + How-would-you-pay fully).
                            card.scrollTo({
                              top: card.scrollHeight,
                              behavior: 'smooth',
                            })
                          }
                        }, 460)
                      }
                    }}
                  >
                    {advancedOpen ? 'Hide advanced options' : 'Show advanced options'}
                    <Chevron />
                  </button>

                  <div
                    ref={advancedRef}
                    className={`calc-advanced${advancedOpen ? ' open' : ''}`}
                    aria-hidden={!advancedOpen}
                  >
                    <div>
                      <FieldLabel>Shading on the roof</FieldLabel>
                      <div className="shading-pills">
                        {([
                          { value: 'none',    label: 'None',    level: 0 },
                          { value: 'partial', label: 'Partial', level: 1 },
                          { value: 'heavy',   label: 'Heavy',   level: 2 },
                        ] as const).map((o) => {
                          const active = shading === o.value
                          return (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => setShading(o.value as Shading)}
                              className={`shading-pill shading-pill--lvl${o.level}${active ? ' is-active' : ''}`}
                            >
                              {o.label}
                            </button>
                          )
                        })}
                      </div>

                      <FieldLabel>How would you pay?</FieldLabel>
                      <Segmented
                        value={financing}
                        onChange={(v) => setFinancing(v as Financing)}
                        options={[
                          { value: 'cash', label: 'Cash' },
                          { value: 'loan', label: 'Loan / EMI' },
                          {
                            value: 'opex',
                            label: 'OPEX / PPA',
                            disabled: segment === 'residential',
                          },
                        ]}
                      />
                      {financing === 'loan' && (
                        <div style={{ marginTop: 14 }}>
                          <FieldLabel inline>Loan tenure</FieldLabel>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            {LOAN_TENURE_OPTIONS.map((y) => (
                              <button
                                key={y}
                                onClick={() => setLoanTenure(y)}
                                style={pillStyle(loanTenure === y)}
                              >
                                {y} yrs
                              </button>
                            ))}
                          </div>
                          <Hint>Indicative rate {(loanRate * 100).toFixed(1)}% p.a.</Hint>
                        </div>
                      )}
                      {/* Scroll sentinel — sits at the bottom of the expanded
                          advanced panel so scrollIntoView reveals all fields */}
                      <div ref={advancedEndRef} style={{ height: 1 }} aria-hidden />
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* ─── RIGHT: savings hero card ─── */}
              <Reveal delay={120}>
                <div className="calc-savings" id="savings-card">
                  <p className="eyebrow" style={{ color: 'var(--leaf-deep)', marginBottom: '10px' }}>
                    Every month back in your pocket
                  </p>
                  <p className={`calc-savings__amount${bump ? ' is-bump' : ''}`}>
                    <sup>₹</sup>
                    <TweenNumber value={result.monthlySavingsYr1} />
                  </p>
                  <p className="calc-savings__caption">
                    A <strong style={{ color: 'var(--ink)' }}>{result.kW} kWp</strong> system in {st.name}
                    {result.roofLimited && (
                      <span style={{ color: 'var(--clay)', fontSize: 12, display: 'block', marginTop: 4 }}>
                        ⚠ Your roof can fit up to {result.roofLimitedKw} kW — bumping savings down a touch.
                      </span>
                    )}
                  </p>

                  <HindiHook
                    monthly={result.monthlySavingsYr1}
                    kW={result.kW}
                    paybackYrs={result.paybackYrs}
                    stateName={st.name}
                    lifetime={result.lifetimeSavings}
                    trigger={`${stateCode}|${segment}|${inputMode}|${monthlyBill}|${monthlyUnits}|${roofSqft}|${shading}|${financing}`}
                  />

                  <div className="calc-mini-stats">
                    <div className="calc-mini-stat">
                      <span className="calc-mini-stat__icon"><ClockStatIcon /></span>
                      <span className="calc-mini-stat__value">
                        <TweenNumber value={result.paybackYrs} format={(n) => n.toFixed(1)} /> yrs
                      </span>
                      <span className="calc-mini-stat__label">Payback</span>
                    </div>
                    <div className="calc-mini-stat">
                      <span className="calc-mini-stat__icon"><WalletStatIcon /></span>
                      <span className="calc-mini-stat__value">
                        <TweenNumber
                          value={result.lifetimeSavings}
                          format={(n) => (n >= 100000 ? `₹${(n / 100000).toFixed(1)} L` : `₹${Math.round(n).toLocaleString('en-IN')}`)}
                        />
                      </span>
                      <span className="calc-mini-stat__label">25-yr savings</span>
                    </div>
                    <div className="calc-mini-stat">
                      <span className="calc-mini-stat__icon"><TreeStatIcon /></span>
                      <span className="calc-mini-stat__value">
                        <TweenNumber value={result.treesEquivalent} /> trees
                      </span>
                      <span className="calc-mini-stat__label">CO₂ offset</span>
                    </div>
                  </div>

                  <div className="calc-savings-ctas" style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                    <a href="/#contact" className="btn btn-primary btn-arrow">
                      Book a free site visit
                    </a>
                    <a
                      href="#detailed"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('detailed')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="calc-link-secondary"
                    >
                      See the 25-year picture →
                    </a>
                  </div>

                  <p style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.04em', marginTop: 8 }}>
                    * Indicative. Conditions apply. Final numbers shared with your free site visit.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Trust pillars — sit below both cards as quiet sub-text */}
            <Reveal delay={200}>
              <div className="calc-trust-pillars">
                <span className="calc-pillar"><CheckIcon /> MNRE-registered EPC</span>
                <span className="calc-pillar"><CheckIcon /> Tier-1 panels only</span>
                <span className="calc-pillar"><CheckIcon /> 5-year free AMC*</span>
                <span className="calc-pillar"><CheckIcon /> Pan-India service</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* DETAIL — cost breakdown, sparkline, gated 25-yr report             */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <section id="detailed" className="section-pad" style={{ background: 'var(--bg)' }}>
          <div className="container-site">
            <div className="section-head">
              <Reveal>
                <Eyebrow>The 25-year picture</Eyebrow>
                <h2 className="h-section" style={{ marginTop: 16 }}>
                  Where the savings come from.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="lede">
                  Solar is an asset, not an expense. Here's how the numbers stack up over a 25-year horizon —
                  the same calculation our engineers run for every site visit.
                </p>
              </Reveal>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(28px, 4vw, 56px)' }} className="max-md:grid-cols-1">
              {/* Cost breakdown card */}
              <Reveal>
                <div style={cardStyle}>
                  <Eyebrow>Cost breakdown</Eyebrow>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
                    <Stat
                      label="Gross cost"
                      value={fmtLakh(result.grossCost)}
                      sub={result.gstAmount > 0 ? `incl. ${fmtRupees(result.gstAmount)} GST` : 'before subsidy'}
                    />
                    {segment === 'residential' ? (
                      <Stat label="PM Surya Ghar*" value={`− ${fmtRupees(result.subsidy)}`} sub="central subsidy" accent />
                    ) : (
                      <Stat label="Tax benefits" value="Up to 40%*" sub="accelerated depreciation in Yr 1" accent />
                    )}
                    <Stat label="Net cost*" value={fmtLakh(result.netCost)} sub="after subsidy" />
                    <Stat label="Year-1 generation" value={`${result.yr1Kwh.toLocaleString('en-IN')} kWh`} sub={`@ ₹${result.tariff}/unit`} />
                  </div>
                  <p style={{ marginTop: 16, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.04em', lineHeight: 1.55 }}>
                    * Indicative. Subsidy and depreciation depend on system size, segment and state policy.
                    Conditions apply.
                  </p>

                  {effectiveFinancing === 'loan' && result.emi !== null && (
                    <div style={financeCardStyle}>
                      <span className="eyebrow" style={{ color: 'var(--ink-mute)' }}>Your EMI</span>
                      <p style={{ fontFamily: 'Newsreader', fontSize: 28, color: 'var(--leaf-deep)', marginTop: 6 }}>
                        {fmtRupees(result.emi)} <span style={{ fontSize: 14, color: 'var(--ink-mute)' }}>/ month</span>
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
                        Over {loanTenure} years at {(loanRate * 100).toFixed(1)}% p.a.
                        — net outflow after Yr-1 savings ≈ {fmtRupees(Math.max(0, result.emi * 12 - result.yearlySavingsYr1))} / yr.
                      </p>
                    </div>
                  )}
                  {effectiveFinancing === 'opex' && result.ppaRate !== null && (
                    <div style={financeCardStyle}>
                      <span className="eyebrow" style={{ color: 'var(--ink-mute)' }}>Your PPA</span>
                      <p style={{ fontFamily: 'Newsreader', fontSize: 28, color: 'var(--leaf-deep)', marginTop: 6 }}>
                        ₹{result.ppaRate}/unit <span style={{ fontSize: 14, color: 'var(--ink-mute)' }}>PPA tariff</span>
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
                        Zero capex. Pay only for the units you consume — savings ≈{' '}
                        {fmtRupees(result.ppaMonthlySavings ?? 0)} / month.
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Sparkline */}
              <Reveal delay={120}>
                <div style={cardStyle}>
                  <Eyebrow>Cumulative savings, year by year</Eyebrow>
                  <p style={{ marginTop: 12, marginBottom: 8, fontSize: 14, color: 'var(--ink-soft)' }}>
                    By year{' '}
                    <strong style={{ color: 'var(--leaf-deep)' }}>{Math.ceil(result.paybackYrs)}</strong>, the
                    system has paid for itself. After that, every rupee saved is profit.
                  </p>
                  <svg className="calc-sparkline" viewBox={`0 0 ${sparkline.w} ${sparkline.h}`} preserveAspectRatio="none" key={`spark-${stateCode}-${monthlyBill}-${monthlyUnits}-${segment}`}>
                    <defs>
                      <linearGradient id="calc-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--leaf)" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="var(--leaf)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={sparkline.dFill} className="calc-sparkline__fill" />
                    <path d={sparkline.d} className="calc-sparkline__path" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.08em', marginTop: 4 }}>
                    <span>Year 1</span>
                    <span>Year 25</span>
                  </div>
                  <p style={{ marginTop: 16, fontSize: 14, color: 'var(--ink-soft)' }}>
                    By year 25:{' '}
                    <strong style={{ color: 'var(--leaf-deep)' }}>{fmtLakh(result.lifetimeSavings)}</strong>{' '}
                    saved · {result.co2Lifetime} tonnes of CO₂ kept out of the air.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* ─── GATE: Detailed 25-yr report ─── */}
            <Reveal>
              <div style={{ marginTop: 56, padding: 'clamp(28px, 4vw, 48px)', borderRadius: 22, background: 'var(--bg-warm)', border: '1px solid var(--rule)' }}>
                {!unlocked ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center' }} className="max-md:grid-cols-1">
                    <div>
                      <Eyebrow>Want the full report?</Eyebrow>
                      <h2 className="h-section" style={{ marginTop: 12, fontSize: 'clamp(26px, 3vw, 36px)' }}>
                        Get the year-by-year breakdown — free.
                      </h2>
                      <p className="lede" style={{ marginTop: 14 }}>
                        See the 25-year savings table, ROI curve and a financing schedule tailored to you.
                        A Garv engineer will also follow up with a no-pressure site visit. Promise — no spam.
                      </p>
                    </div>
                    <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <input
                        required
                        placeholder="Your name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="WhatsApp number (+91…)"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        style={inputStyle}
                      />
                      <button type="submit" className="btn btn-leaf btn-arrow" style={{ alignSelf: 'flex-start', marginTop: 6 }}>
                        Unlock my report
                      </button>
                      <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                        We use your details only to share this report and a free site visit.
                      </p>
                    </form>
                  </div>
                ) : (
                  <DetailedReport />
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Floating mobile-only savings pill — keeps the result visible while
            the user interacts with the form above. Updates live, bumps on
            change, scrolls to the savings card on tap. */}
        <div className="calc-mobile-pill" aria-live="polite">
          <div className="calc-mobile-pill__info">
            <span className="calc-mobile-pill__label">You'd save</span>
            <span className={`calc-mobile-pill__amount${bump ? ' is-bump' : ''}`}>
              ₹<TweenNumber value={result.monthlySavingsYr1} />
              <span className="calc-mobile-pill__amount-suffix">/ mo</span>
            </span>
          </div>
          <a
            href="#savings-card"
            className="calc-mobile-pill__cta"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('savings-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            Details ↓
          </a>
        </div>
      </main>
      <Footer />
    </>
  )

  // ─── Detailed report ──────────────────────────────────────────────────────
  function DetailedReport() {
    return (
      <div>
        <Eyebrow>Your 25-year report</Eyebrow>
        <h2 className="h-section" style={{ marginTop: 12, marginBottom: 24, fontSize: 'clamp(26px, 3vw, 36px)' }}>
          Hi {leadName.split(' ')[0]}, here's the full picture.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: 14, overflow: 'hidden', marginBottom: 32 }} className="max-md:grid-cols-2">
          <BigStat label="Lifetime savings" value={fmtLakh(result.lifetimeSavings)} accent />
          <BigStat label="Lifetime generation" value={`${(result.lifetimeKwh / 1000).toFixed(1)} MWh`} />
          <BigStat label="CO₂ avoided" value={`${result.co2Lifetime} t`} />
          <BigStat label="Trees-equivalent" value={result.treesEquivalent.toLocaleString('en-IN')} />
        </div>

        {result.emi !== null && (
          <div style={{ marginBottom: 32, padding: 24, background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--rule)' }}>
            <p className="eyebrow" style={{ color: 'var(--ink-mute)' }}>EMI schedule</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 14 }} className="max-sm:grid-cols-2">
              <KV k="Monthly EMI" v={fmtRupees(result.emi)} />
              <KV k="Tenure" v={`${loanTenure} years`} />
              <KV k="Total interest" v={fmtRupees(result.emi * loanTenure * 12 - result.netCost)} />
              <KV k="Total payable" v={fmtRupees(result.emi * loanTenure * 12)} />
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
                <th style={th}>Year</th>
                <th style={th}>Generation (kWh)</th>
                <th style={th}>Annual savings</th>
                <th style={th}>Cumulative savings</th>
              </tr>
            </thead>
            <tbody>
              {result.projection.map((r) => (
                <tr key={r.year} style={{ borderBottom: '1px solid color-mix(in oklch, var(--rule) 60%, transparent)' }}>
                  <td style={td}>{r.year}</td>
                  <td style={td}>{r.kwh.toLocaleString('en-IN')}</td>
                  <td style={td}>{fmtRupees(r.savings)}</td>
                  <td style={{ ...td, color: r.cumulativeSavings >= result.netCost ? 'var(--leaf-deep)' : 'var(--ink)' }}>
                    {fmtRupees(r.cumulativeSavings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/#contact" className="btn btn-leaf btn-arrow">
            Talk to an engineer
          </a>
          {/* <button onClick={() => window.print()} className="btn btn-ghost">
            Print / save PDF
          </button> */}
        </div>
      </div>
    )
  }
}

// ─── Sub-components & styles ─────────────────────────────────────────────────

function FriendlyLabel({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14, marginBottom: 8 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'color-mix(in oklch, var(--ink) 9%, transparent)',
          color: 'var(--ink-soft)',
          fontFamily: 'IBM Plex Mono',
          fontSize: 10,
          letterSpacing: 0,
          fontWeight: 500,
        }}
      >
        {step}
      </span>
      <span style={{ fontFamily: 'Newsreader', fontSize: 17, color: 'var(--ink)' }}>{children}</span>
    </div>
  )
}

function FieldLabel({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <p
      className="eyebrow"
      style={{
        color: 'var(--ink-mute)',
        marginTop: inline ? 0 : 20,
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 8, lineHeight: 1.5 }}>{children}</p>
}

// iOS-style segmented tab control (pill track, floating active chip)
function Tabs({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
}) {
  return (
    <div className="calc-tabs" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          disabled={o.disabled}
          onClick={() => !o.disabled && onChange(o.value)}
          className={`calc-tab${value === o.value ? ' is-active' : ''}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// Ochre-pill property type selector
function PropertyPills({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
}) {
  return (
    <div className="property-pills">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={o.disabled}
          onClick={() => !o.disabled && onChange(o.value)}
          className={`property-pill${value === o.value ? ' is-active' : ''}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// Searchable popover-style select — in the spirit of shadcn-space/select-08
function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; meta?: string }[]
  placeholder?: string
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Auto-focus search on open + reset query
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(Math.max(0, options.findIndex((o) => o.value === value)))
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open, value, options])

  // Keep active item in view
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLLIElement>(`[data-idx="${activeIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx, open, filtered])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = filtered[activeIdx]
      if (pick) {
        onChange(pick.value)
        setOpen(false)
      }
    }
  }

  return (
    <div className="combo" ref={rootRef}>
      <button
        type="button"
        className={`combo__trigger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={`combo__value${selected ? '' : ' is-placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        {selected?.meta && <span className="combo__meta">{selected.meta}</span>}
        <svg className="combo__chevron" width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
          <path d="M3 5.5 L7 9.5 L11 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="combo__popover" role="dialog">
          <div className="combo__search">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" style={{ flexShrink: 0, color: 'var(--ink-mute)' }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5 L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIdx(0) }}
              onKeyDown={handleKey}
              placeholder="Search…"
              aria-label="Search options"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="combo__clear" aria-label="Clear search">
                ×
              </button>
            )}
          </div>
          <ul className="combo__list" ref={listRef} role="listbox">
            {filtered.length === 0 && (
              <li className="combo__empty">No matches</li>
            )}
            {filtered.map((o, i) => {
              const isSelected = o.value === value
              const isActive = i === activeIdx
              return (
                <li
                  key={o.value}
                  data-idx={i}
                  className={`combo__option${isActive ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="combo__option-label">{o.label}</span>
                  {o.meta && <span className="combo__option-meta">{o.meta}</span>}
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
                      <path d="M3 7.2 L5.8 9.8 L11 4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

// Two-state toggle switch (iOS-style) — labels on either side, sliding thumb
function ToggleSwitch({
  value,
  options,
  onChange,
}: {
  value: string
  options: [{ value: string; label: string }, { value: string; label: string }]
  onChange: (v: string) => void
}) {
  const [left, right] = options
  const isRight = value === right.value
  return (
    <div className="bill-switch">
      <button
        type="button"
        className={`bill-switch__label${!isRight ? ' is-active' : ''}`}
        onClick={() => onChange(left.value)}
      >
        {left.label}
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={isRight}
        onClick={() => onChange(isRight ? left.value : right.value)}
        className={`bill-switch__track${isRight ? ' is-on' : ''}`}
        aria-label={`Toggle between ${left.label} and ${right.label}`}
      >
        <span className="bill-switch__thumb" />
      </button>
      <button
        type="button"
        className={`bill-switch__label${isRight ? ' is-active' : ''}`}
        onClick={() => onChange(right.value)}
      >
        {right.label}
      </button>
    </div>
  )
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            onClick={() => !o.disabled && onChange(o.value)}
            disabled={o.disabled}
            style={{
              flex: '1 1 auto',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 13.5,
              fontWeight: active ? 500 : 500,
              letterSpacing: '-0.005em',
              textTransform: 'none',
              padding: '11px 18px',
              borderRadius: 999,
              cursor: o.disabled ? 'not-allowed' : 'pointer',
              border: '1px solid',
              borderColor: active ? 'var(--leaf-deep)' : 'var(--rule)',
              background: active ? 'var(--leaf-deep)' : 'transparent',
              color: active ? 'var(--bg)' : o.disabled ? 'var(--ink-mute)' : 'var(--ink-soft)',
              opacity: o.disabled ? 0.5 : 1,
              transition: 'background 0.18s, color 0.18s, border-color 0.18s',
              whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function FriendlySlider({
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
  bump,
  leaf,
}: {
  label?: React.ReactNode
  display: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  bump?: boolean
  leaf?: boolean
}) {
  return (
    <div style={{ marginTop: label ? 14 : 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        {label && (
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
            {label}
          </span>
        )}
        <span className={`calc-slider-value${bump ? ' bump' : ''}`} style={!label ? { marginLeft: 'auto' } : undefined}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className={leaf ? 'is-leaf' : undefined}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>
        <span>{min.toLocaleString('en-IN')}</span>
        <span>{max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{ padding: '18px 20px', background: 'var(--bg-warm)', borderRadius: 12, border: '1px solid var(--rule)' }}>
      <p className="eyebrow" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'Newsreader', fontSize: 'clamp(20px, 2.2vw, 26px)', lineHeight: 1.1, color: accent ? 'var(--leaf-deep)' : 'var(--ink)' }}>
        {value}
      </p>
      {sub && <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ink-mute)', marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function BigStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ padding: '24px 22px', background: 'var(--bg)' }}>
      <p className="eyebrow" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'Newsreader', fontSize: 'clamp(24px, 2.6vw, 32px)', color: accent ? 'var(--leaf-deep)' : 'var(--ink)', lineHeight: 1.1 }}>{value}</p>
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="eyebrow" style={{ color: 'var(--ink-mute)', marginBottom: 4 }}>{k}</p>
      <p style={{ fontFamily: 'Newsreader', fontSize: 18, color: 'var(--ink)' }}>{v}</p>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  padding: 'clamp(22px, 2.6vw, 32px)',
  background: 'var(--bg)',
  border: '1px solid var(--rule)',
  borderRadius: 20,
}

const financeCardStyle: React.CSSProperties = {
  marginTop: 18,
  padding: '18px 20px',
  background: 'color-mix(in oklch, var(--leaf-soft) 60%, var(--bg))',
  border: '1px solid color-mix(in oklch, var(--leaf) 28%, var(--rule))',
  borderRadius: 14,
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid var(--rule)',
  background: 'var(--bg)',
  fontFamily: 'IBM Plex Sans',
  fontSize: 14,
  color: 'var(--ink)',
  width: '100%',
}

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  borderRadius: 999,
  border: '1px solid',
  borderColor: active ? 'var(--leaf-deep)' : 'var(--rule)',
  background: active ? 'var(--leaf-deep)' : 'transparent',
  color: active ? 'var(--bg)' : 'var(--ink-soft)',
  fontFamily: 'IBM Plex Mono',
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  cursor: 'pointer',
})

const th: React.CSSProperties = {
  fontFamily: 'IBM Plex Mono',
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--ink-mute)',
  padding: '12px 10px',
  fontWeight: 500,
}

const td: React.CSSProperties = {
  padding: '10px',
  fontFamily: 'IBM Plex Sans',
  color: 'var(--ink)',
}

export default function CalculatorPageWrapper() {
  return (
    <Suspense>
      <CalculatorPage />
    </Suspense>
  )
}
