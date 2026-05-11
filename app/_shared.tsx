'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Atom Components ────────────────────────────────────────────────────────

export function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p className="eyebrow" style={style}>{children}</p>
}

export function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function Plus({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      className={`faq-icon${open ? ' open' : ''}`}
      aria-hidden
    >
      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function SunMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="6" fill="var(--ochre)" />
      <circle cx="16" cy="16" r="10" stroke="var(--ochre)" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="16" cy="16" r="14" stroke="var(--ochre)" strokeWidth="1" strokeOpacity="0.25" />
    </svg>
  )
}

export function ImgPh({
  src,
  alt,
  tag,
  className = '',
  style = {},
}: {
  src?: string
  alt?: string
  tag?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`img-ph ${className}`} style={style}>
      {src ? (
        <img src={src} alt={alt || ''} loading="lazy" />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `repeating-linear-gradient(
              45deg,
              var(--bg-deep),
              var(--bg-deep) 4px,
              var(--bg-warm) 4px,
              var(--bg-warm) 10px
            )`,
          }}
        />
      )}
      {tag && <span className="img-ph-tag">{tag}</span>}
    </div>
  )
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}

export function Counter({
  target,
  suffix = '',
  duration = 1800,
}: {
  target: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let frame: number
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(ease * target))
      if (t < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration])

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
}

// ─── Nav (shared across pages) ─────────────────────────────────────────────

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Home Solar', href: '/home-solar' },
  { label: 'Commercial', href: '/commercial-solar' },
  { label: 'Projects', href: '/#projects' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled
          ? 'color-mix(in oklch, var(--bg) 88%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--rule)' : '1px solid transparent',
        transition: 'padding 0.3s, background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      }}
    >
      <div className="container-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--ochre)',
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 500 }}>
            Garv Urja Solutions
          </span>
        </a>

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-soft)')}
            >
              {label}
            </a>
          ))}
          <a href="/#contact" className="btn btn-primary" style={{ padding: '10px 18px' }}>
            Get a Quote
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: 4 }}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            ) : (
              <>
                <path d="M3 7H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg)',
          borderTop: '1px solid var(--rule)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              {label}
            </a>
          ))}
          <a href="/#contact" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Get a Quote
          </a>
        </div>
      )}
    </header>
  )
}

// ─── Footer (shared across pages) ──────────────────────────────────────────

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--bg)', padding: 'clamp(48px, 7vw, 96px) 0 32px' }}>
      <div className="container-site">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 40,
            paddingBottom: 56,
            borderBottom: '1px solid color-mix(in oklch, var(--bg) 12%, transparent)',
          }}
          className="max-md:grid-cols-2 max-sm:grid-cols-1"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ochre)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bg)', fontWeight: 500 }}>Garv Urja Solutions</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: 'color-mix(in oklch, var(--bg) 55%, transparent)', maxWidth: 280, marginBottom: 20 }}>
              MNRE Registered trusted solar EPC company. Designing, building and maintaining clean energy systems.
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', color: 'color-mix(in oklch, var(--bg) 35%, transparent)' }}>
              Registered Vendor
            </p>
          </div>

          {/* Solutions */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginBottom: 16 }}>Solutions</p>
            {[
              { label: 'Home Solar', href: '/home-solar' },
              { label: 'Commercial Solar', href: '/commercial-solar' },
              { label: 'Ground-Mount EPC', href: '/#services' },
              { label: 'O&M / AMC', href: '/#services' },
              { label: 'Solar Pumps', href: '/#services' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'color-mix(in oklch, var(--bg) 65%, transparent)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginBottom: 16 }}>Company</p>
            {[
              { label: 'About', href: '/#about' },
              { label: 'Projects', href: '/#projects' },
              { label: 'Calculator', href: '/#calculator' },
              { label: 'FAQs', href: '/faqs' },
              { label: 'Contact', href: '/#contact' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'color-mix(in oklch, var(--bg) 65%, transparent)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginBottom: 16 }}>Get In Touch</p>
            <p style={{ fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', lineHeight: 1.6, marginBottom: 12 }}>
              I-15, Ambedkar Nagar,<br />Alwar, Rajasthan – 301001
            </p>
            <a href="tel:+918810405990" style={{ display: 'block', fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', textDecoration: 'none', marginBottom: 6 }}>+91-8810405990</a>
            <a href="mailto:garvurjasolutions@gmail.com" style={{ display: 'block', fontSize: 14, color: 'var(--ochre)', textDecoration: 'none' }}>garvurjasolutions@gmail.com</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', color: 'color-mix(in oklch, var(--bg) 35%, transparent)' }}>
            © {new Date().getFullYear()} Garv Urja Solutions. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 35%, transparent)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
