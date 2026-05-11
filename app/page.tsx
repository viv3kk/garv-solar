'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Atom Components ────────────────────────────────────────────────────────

function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p className="eyebrow" style={style}>{children}</p>
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Plus({ open }: { open: boolean }) {
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

function SunMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="6" fill="var(--ochre)" />
      <circle cx="16" cy="16" r="10" stroke="var(--ochre)" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="16" cy="16" r="14" stroke="var(--ochre)" strokeWidth="1" strokeOpacity="0.25" />
    </svg>
  )
}

function ImgPh({
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

function Reveal({
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

function Counter({
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

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
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
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--ochre)',
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 500 }}>
            Garv Urja Solar
          </span>
        </a>

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
          {['About', 'Services', 'Projects', 'Calculator', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
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
              {item}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary" style={{ padding: '10px 18px' }}>
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
          {['About', 'Services', 'Projects', 'Calculator', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
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
              {item}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Get a Quote
          </a>
        </div>
      )}
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

const HERO_METRICS = [
  { value: 200, suffix: '+', label: 'MW Commissioned' },
  { value: 1400, suffix: '+', label: 'Installations' },
  { value: 13, suffix: ' yrs', label: 'In Operation' },
  { value: 98, suffix: '%', label: 'Uptime SLA' },
]

function HeroBlob({ color, style }: { color: string; style: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        borderRadius: '50%',
        background: color,
        filter: 'blur(80px)',
        opacity: 0.22,
        ...style,
      }}
    />
  )
}

function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(88px, 10vh, 120px)',
        paddingBottom: 'clamp(60px, 8vw, 120px)',
        background: 'var(--bg-warm)',
      }}
    >
      {/* Animated background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Blobs */}
        <HeroBlob
          color="var(--ochre)"
          style={{
            width: 560, height: 560,
            top: '10%', left: '5%',
            animation: 'blob-drift-a 22s ease-in-out infinite alternate',
          }}
        />
        <HeroBlob
          color="var(--moss)"
          style={{
            width: 480, height: 480,
            bottom: '5%', right: '8%',
            animation: 'blob-drift-b 28s ease-in-out infinite alternate',
          }}
        />

        {/* Sun-ray conic gradient */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 900, height: 900,
          marginLeft: -450, marginTop: -450,
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            color-mix(in oklch, var(--ochre) 8%, transparent) 15deg,
            transparent 30deg,
            color-mix(in oklch, var(--ochre) 5%, transparent) 45deg,
            transparent 60deg,
            color-mix(in oklch, var(--ochre) 8%, transparent) 75deg,
            transparent 90deg,
            color-mix(in oklch, var(--moss) 6%, transparent) 105deg,
            transparent 120deg,
            color-mix(in oklch, var(--ochre) 6%, transparent) 135deg,
            transparent 150deg,
            color-mix(in oklch, var(--ochre) 8%, transparent) 165deg,
            transparent 180deg,
            color-mix(in oklch, var(--moss) 6%, transparent) 195deg,
            transparent 210deg,
            color-mix(in oklch, var(--ochre) 5%, transparent) 225deg,
            transparent 240deg,
            color-mix(in oklch, var(--ochre) 8%, transparent) 255deg,
            transparent 270deg,
            color-mix(in oklch, var(--moss) 6%, transparent) 285deg,
            transparent 300deg,
            color-mix(in oklch, var(--ochre) 8%, transparent) 315deg,
            transparent 330deg,
            color-mix(in oklch, var(--ochre) 5%, transparent) 345deg,
            transparent 360deg
          )`,
          animation: 'sun-rotate 90s linear infinite',
        }} />

        {/* Floating motes */}
        {[
          { x: 12, y: 20, s: 6, c: 'ochre', d: 0 },
          { x: 25, y: 55, s: 4, c: 'moss', d: 0.8 },
          { x: 38, y: 15, s: 5, c: 'ochre', d: 1.6 },
          { x: 52, y: 72, s: 7, c: 'ochre', d: 0.4 },
          { x: 65, y: 30, s: 4, c: 'moss', d: 2.1 },
          { x: 74, y: 58, s: 6, c: 'ochre', d: 1.2 },
          { x: 82, y: 18, s: 5, c: 'moss', d: 0.9 },
          { x: 90, y: 80, s: 4, c: 'ochre', d: 1.7 },
          { x: 18, y: 85, s: 5, c: 'moss', d: 2.5 },
          { x: 44, y: 42, s: 3, c: 'ochre', d: 0.6 },
          { x: 58, y: 88, s: 6, c: 'moss', d: 1.4 },
          { x: 70, y: 10, s: 4, c: 'ochre', d: 3.0 },
          { x: 88, y: 45, s: 5, c: 'moss', d: 2.2 },
          { x: 30, y: 70, s: 3, c: 'ochre', d: 1.9 },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.s,
              height: m.s,
              borderRadius: '50%',
              background: `var(--${m.c})`,
              opacity: 0.55,
              animation: `mote-float ${3.5 + i * 0.3}s ease-in-out ${m.d}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="container-site" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'end' }}
          className="max-md:grid-cols-1">
          {/* Left: headline */}
          <div style={{ animation: 'fade-in 0.8s ease both', animationDelay: '0.1s' }}>
            <Eyebrow>Est. 2011 · Anand, Gujarat</Eyebrow>
            <h1 className="h-display" style={{ marginTop: 20, marginBottom: 24 }}>
              Power your world<br />
              <em style={{ color: 'var(--ochre)' }}>with the sun.</em>
            </h1>
            <p className="lede" style={{ maxWidth: 460, marginBottom: 36 }}>
              Garv Urja Solar designs, installs and maintains rooftop and ground-mount solar systems for homes, industries and utilities across Gujarat and beyond.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#calculator" className="btn btn-primary btn-arrow">Calculate Savings</a>
              <a href="#projects" className="btn btn-ghost">See Our Work</a>
            </div>
          </div>

          {/* Right: image + metrics */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            animation: 'fade-in 0.8s ease both',
            animationDelay: '0.3s',
          }}>
            {/* Hero image */}
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '16/9',
              position: 'relative',
              flexShrink: 0,
            }}>
              <img
                src="/images/services-rooftop-happy-family-landscape.png"
                alt="Family with rooftop solar installation at sunset"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 50%)',
              }} />
              <span style={{
                position: 'absolute', bottom: 12, left: 12,
                fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
              }}>Gujarat residential install</span>
            </div>

            {/* Metrics grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'var(--rule)',
              border: '1px solid var(--rule)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              {HERO_METRICS.map(({ value, suffix, label }) => (
                <div key={label} style={{ background: 'var(--bg)', padding: 'clamp(16px, 2vw, 24px)' }}>
                  <div className="stat-big" style={{ marginBottom: 6 }}>
                    <Counter target={value} suffix={suffix} />
                  </div>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 1, height: 40, background: 'var(--ink-mute)' }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Scroll</span>
        </div>
      </div>
    </section>
  )
}

// ─── Marquee ─────────────────────────────────────────────────────────────────

const SERVICES_TICKER = [
  'Rooftop Solar', 'Ground-Mount EPC', 'Operations & Maintenance',
  'Solar Pumps', 'Battery Storage', 'Net Metering', 'Industrial Solar',
  'Cold-Storage Solar', 'Agricultural Solar', 'Subsidy Assistance',
]

function Marquee() {
  const items = [...SERVICES_TICKER, ...SERVICES_TICKER]
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid var(--rule)',
      borderBottom: '1px solid var(--rule)',
      padding: '18px 0',
      background: 'var(--bg-warm)',
    }}>
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 28,
            fontStyle: 'italic',
            color: 'var(--ink-soft)',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}>
            {item}
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre)', display: 'inline-block', flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Our Story</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Gujarat's solar pioneers since 2011.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Founded as Jangid Solar and reborn as Garv Urja Solar, we've spent over thirteen years turning rooftops and barren land into clean power generators. From a modest workshop in Anand to a full-service EPC company, every project has been a step toward a fossil-free Gujarat.
            </p>
            <div style={{ marginTop: 28 }}>
              <a href="#contact" className="btn btn-ghost btn-arrow">Work With Us</a>
            </div>
          </Reveal>
        </div>

        {/* Editorial 2-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }} className="max-md:grid-cols-1">
          <Reveal>
            <ImgPh
              src="/images/about-home-solar.jpg.png"
              alt="Family on balcony with rooftop solar panels at sunset"
              tag="Anand, Gujarat"
              style={{ aspectRatio: '4/3', borderRadius: 16 }}
            />
          </Reveal>
          <Reveal delay={120}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                {
                  num: '01',
                  title: 'End-to-End EPC',
                  body: 'We handle everything — site survey, system design, civil, electrical, and commissioning — so you get a single point of accountability.',
                },
                {
                  num: '02',
                  title: 'ISO 9001:2015 Certified',
                  body: "Quality management isn't a checkbox for us; it's the backbone of every installation, from wiring harness to inverter selection.",
                },
                {
                  num: '03',
                  title: 'Long-term Partnership',
                  body: 'Our O&M contracts keep your system running at peak yield for 25 years, with remote monitoring and rapid-response field teams.',
                },
              ].map(({ num, title, body }) => (
                <div key={num} style={{ display: 'flex', gap: 20, paddingBottom: 28, borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em', paddingTop: 3, flexShrink: 0 }}>{num}</span>
                  <div>
                    <h3 style={{ fontFamily: 'Newsreader', fontSize: 20, marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'rooftop',
    label: 'Rooftop',
    title: 'Rooftop Solar for Homes & MSMEs',
    body: 'From a 3 kW home system to a 500 kW MSME rooftop, we design grid-tied and hybrid systems that maximise subsidy capture and minimise payback periods.',
    bullets: ['PM Surya Ghar subsidy assistance', 'On-grid, off-grid & hybrid options', 'Shadow-free layout with string optimisers', 'Bi-facial module options for high yield'],
    img: '/images/services-rooftop-happy-family.png',
    imgTag: 'Residential install, Vadodara',
  },
  {
    id: 'ground',
    label: 'Ground-Mount',
    title: 'Ground-Mount & Utility Projects',
    body: 'For industries, municipalities and farmers looking to utilise open land, we deliver MW-scale ground-mounted plants with full DC/AC engineering and grid-synchronisation.',
    bullets: ['1 kW to multi-MW turnkey projects', 'Agri-solar (agrivoltaic) designs', 'Screw piles or concrete foundations', 'SCADA & remote monitoring'],
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80&auto=format&fit=crop',
    imgTag: 'Ground-mount array, Anand',
  },
  {
    id: 'epc',
    label: 'EPC Services',
    title: 'Full EPC for Commercial & Industrial',
    body: 'We act as the single contract EPC partner for C&I clients — handling procurement, civil, electrical, net-metering, and commissioning under one roof.',
    bullets: ['Single contract accountability', 'Detailed energy yield simulation', 'Net-metering & banking advisory', 'DPR preparation & bank funding support'],
    img: '/images/services-epc.png',
    imgTag: 'Industrial EPC, GIDC Anand',
  },
  {
    id: 'om',
    label: 'O&M',
    title: 'Operations & Maintenance',
    body: 'A solar plant is a 25-year asset. Our AMC and O&M contracts protect that asset with regular audits, cleaning schedules, inverter servicing and remote performance monitoring.',
    bullets: ['Annual & comprehensive AMC plans', 'Remote SCADA performance alerts', 'Panel cleaning & thermography', 'Rapid response within 24 hours'],
    img: 'https://images.unsplash.com/photo-1591105327764-d20bbf65a25c?w=900&q=80&auto=format&fit=crop',
    imgTag: 'O&M inspection, Gujarat',
  },
]

function Services() {
  const [active, setActive] = useState(0)
  const svc = SERVICES[active]

  return (
    <section id="services" className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Solar, end-to-end.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Whether you need a rooftop system for your home or a utility-scale ground-mount project, our integrated team covers every phase from feasibility to long-term uptime.
            </p>
          </Reveal>
        </div>

        {/* Tab strip */}
        <div className="tab-strip">
          {SERVICES.map((s, i) => (
            <button key={s.id} className={`tab-btn${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div key={svc.id} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center',
          animation: 'fade-in 0.4s ease both',
        }} className="max-md:grid-cols-1">
          <div>
            <h3 className="h-card" style={{ marginBottom: 16 }}>{svc.title}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)', marginBottom: 24 }}>{svc.body}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {svc.bullets.map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--ochre)', flexShrink: 0 }}>→</span>
                  {b}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 28 }}>
              <a href="#contact" className="btn btn-primary btn-arrow">Enquire Now</a>
            </div>
          </div>
          <ImgPh
            src={svc.img}
            alt={svc.title}
            tag={svc.imgTag}
            style={{ aspectRatio: '4/3', borderRadius: 16 }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Process ─────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: '01', title: 'Site Survey', body: 'Our engineers visit your site to assess shadow patterns, roof strength, orientation and grid-connection point.' },
  { num: '02', title: 'System Design', body: 'We produce a detailed engineering design — module layout, single-line diagrams, energy simulations and financial projections.' },
  { num: '03', title: 'Approvals & DPR', body: 'We prepare the DPR, apply for net-metering approvals and coordinate DISCOM permissions on your behalf.' },
  { num: '04', title: 'Procurement', body: 'Tier-1 modules, Tier-1 inverters, galvanised structures and BIS-certified cables — sourced and inspected at our warehouse.' },
  { num: '05', title: 'Installation', body: 'Our certified electricians and civil crews complete the install in 3–10 working days depending on system size.' },
  { num: '06', title: 'Commissioning & O&M', body: 'We commission the plant with DISCOM, hand over monitoring access, and optionally continue with a long-term AMC.' },
]

function Process() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <Reveal>
          <div style={{ marginBottom: 'clamp(40px, 5vw, 72px)' }}>
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16, maxWidth: 520 }}>
              From handshake to kilowatts in six steps.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--rule)' }} className="max-sm:grid-cols-1 max-md:grid-cols-2">
          {PROCESS_STEPS.map(({ num, title, body }, i) => (
            <Reveal key={num} delay={i * 60}>
              <div style={{
                background: 'var(--bg)',
                padding: 'clamp(24px, 3vw, 40px)',
                height: '100%',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--ochre)', letterSpacing: '0.12em' }}>{num}</span>
                <h3 style={{ fontFamily: 'Newsreader', fontSize: 22, marginTop: 16, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Calculator ───────────────────────────────────────────────────────────────

function Calculator() {
  const [units, setUnits] = useState(300)
  const [type, setType] = useState<'residential' | 'commercial'>('residential')
  const [roofArea, setRoofArea] = useState(500)

  const tariff = type === 'residential' ? 8.5 : 9.5
  const kW = Math.max(1, Math.round(units / 120))
  const yearlySavings = Math.round(units * 12 * tariff)
  const monthlySavings = Math.round(units * tariff)
  const co2 = Math.round(units * 12 * 0.82 / 1000 * 10) / 10
  const cost = kW * 55000
  const payback = Math.round(cost / yearlySavings * 10) / 10

  return (
    <section id="calculator" className="section-pad calc-section">
      <div className="container-site">
        <div className="section-head" style={{ color: 'var(--bg)' }}>
          <Reveal>
            <Eyebrow>Solar Calculator</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16, color: 'var(--bg)' }}>
              See what the sun saves you.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.6, color: 'color-mix(in oklch, var(--bg) 70%, transparent)', marginBottom: 0 }}>
              Enter your average monthly electricity consumption and we'll estimate the system size, savings and payback period for your location in Gujarat.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="max-md:grid-cols-1">
          {/* Inputs */}
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Savings visual */}
              <div style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
                <img
                  src="/images/client-happy-bill.png"
                  alt="Family reviewing solar savings on electricity bill"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, color-mix(in oklch, var(--ink) 70%, transparent) 0%, transparent 55%)',
                }} />
                <p style={{
                  position: 'absolute', bottom: 14, left: 14,
                  fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
                }}>Real savings, every month</p>
              </div>
              {/* Property type */}
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 60%, transparent)', display: 'block', marginBottom: 14 }}>Property Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {(['residential', 'commercial'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className="btn"
                      style={{
                        background: type === t ? 'var(--ochre)' : 'transparent',
                        color: type === t ? 'var(--bg)' : 'color-mix(in oklch, var(--bg) 60%, transparent)',
                        borderColor: type === t ? 'var(--ochre)' : 'color-mix(in oklch, var(--bg) 25%, transparent)',
                        padding: '10px 18px',
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly units */}
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 60%, transparent)', display: 'block', marginBottom: 8 }}>
                  Monthly Consumption: <span style={{ color: 'var(--ochre)' }}>{units} units</span>
                </label>
                <input type="range" min={50} max={2000} step={25} value={units} onChange={e => setUnits(+e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginTop: 6 }}>
                  <span>50 units</span><span>2000 units</span>
                </div>
              </div>

              {/* Roof area */}
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 60%, transparent)', display: 'block', marginBottom: 8 }}>
                  Available Roof Area: <span style={{ color: 'var(--sage)' }}>{roofArea} sq ft</span>
                </label>
                <input type="range" min={100} max={5000} step={50} value={roofArea} onChange={e => setRoofArea(+e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginTop: 6 }}>
                  <span>100 sq ft</span><span>5000 sq ft</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Output */}
          <Reveal delay={100}>
            <div style={{
              background: 'color-mix(in oklch, var(--bg) 7%, transparent)',
              border: '1px solid color-mix(in oklch, var(--bg) 14%, transparent)',
              borderRadius: 20,
              padding: 'clamp(24px, 3vw, 40px)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              overflow: 'hidden',
            }}>
              {[
                { label: 'Recommended Size', value: `${kW} kWp`, sub: 'system capacity' },
                { label: 'Monthly Savings', value: `₹${monthlySavings.toLocaleString('en-IN')}`, sub: `@ ₹${tariff}/unit` },
                { label: 'Yearly Savings', value: `₹${yearlySavings.toLocaleString('en-IN')}`, sub: 'estimated savings' },
                { label: 'CO₂ Offset', value: `${co2} t/yr`, sub: 'tonnes per year' },
                { label: 'Approx. Cost', value: `₹${(cost / 100000).toFixed(1)}L`, sub: 'before subsidy' },
                { label: 'Payback Period', value: `${payback} yrs`, sub: 'return on investment' },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{ padding: 'clamp(16px, 2vw, 24px)', background: 'color-mix(in oklch, var(--bg) 5%, transparent)' }}>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 45%, transparent)', marginBottom: 8 }}>{label}</p>
                  <p style={{ fontFamily: 'Newsreader', fontSize: 'clamp(22px, 2.5vw, 30px)', color: 'var(--bg)', lineHeight: 1.1, marginBottom: 4 }}>{value}</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'color-mix(in oklch, var(--bg) 40%, transparent)' }}>{sub}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: 'color-mix(in oklch, var(--bg) 38%, transparent)', lineHeight: 1.5 }}>
              * Estimates based on Gujarat solar irradiation (5.2 kWh/m²/day) and current DISCOM tariff rates. Actual savings may vary.
            </p>
            <div style={{ marginTop: 20 }}>
              <a href="#contact" className="btn" style={{ background: 'var(--ochre)', color: 'var(--bg)', borderColor: 'var(--ochre)' }}>
                Get a Detailed Proposal <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: 'Cold Storage Solar, Anand',
    size: '120 kWp',
    type: 'Ground-Mount',
    year: '2024',
    img: '/images/project-industrial.png',
    tag: 'Anand, Gujarat',
  },
  {
    title: 'Industrial Rooftop, Vadodara',
    size: '250 kWp',
    type: 'Rooftop EPC',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80&auto=format&fit=crop',
    tag: 'Vadodara, Gujarat',
  },
  {
    title: 'Residential Complex, Surat',
    size: '60 kWp',
    type: 'Rooftop',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=900&q=80&auto=format&fit=crop',
    tag: 'Surat, Gujarat',
  },
  {
    title: 'Agri-Solar Farm, Mehsana',
    size: '500 kWp',
    type: 'Ground-Mount',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80&auto=format&fit=crop',
    tag: 'Mehsana, Gujarat',
  },
]

function Projects() {
  return (
    <section id="projects" className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Our Work</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Projects we're proud of.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Over 1,400 installations across residential, commercial, industrial and agricultural segments — here's a selection.
            </p>
            <div style={{ marginTop: 24 }}>
              <a href="#contact" className="btn btn-ghost btn-arrow">View All Projects</a>
            </div>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="max-md:grid-cols-1">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <article style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--rule)', background: 'var(--bg)' }}>
                <ImgPh src={p.img} alt={p.title} tag={p.tag} style={{ aspectRatio: '16/9' }} />
                <div style={{ padding: 'clamp(16px, 2vw, 28px)' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span className="tag-pill">{p.type}</span>
                    <span className="tag-pill">{p.size}</span>
                    <span className="tag-pill">{p.year}</span>
                  </div>
                  <h3 className="h-card">{p.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Impact ───────────────────────────────────────────────────────────────────

const IMPACT_STATS = [
  { value: 200, suffix: '+', label: 'MW Commissioned', unit: 'megawatts' },
  { value: 1400, suffix: '+', label: 'Installations', unit: 'projects' },
  { value: 280000, suffix: '', label: 'Tonnes CO₂ Avoided', unit: 'lifetime est.' },
  { value: 350, suffix: 'Cr+', label: 'Client Savings', unit: '₹ cumulative' },
]

function Impact() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-deep)' }}>
      <div className="container-site">
        <Reveal style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <Eyebrow>Our Impact</Eyebrow>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--rule)' }} className="max-md:grid-cols-2">
          {IMPACT_STATS.map(({ value, suffix, label, unit }, i) => (
            <Reveal key={label} delay={i * 80}>
              <div style={{ background: 'var(--bg-deep)', padding: 'clamp(24px, 3vw, 40px)', textAlign: 'center' }}>
                <div className="stat-big" style={{ marginBottom: 8 }}>
                  <Counter target={value} suffix={suffix} />
                </div>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ochre)', letterSpacing: '0.1em' }}>{unit}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Shop ─────────────────────────────────────────────────────────────────────

const SHOP_PRODUCTS = [
  { name: 'Bi-Facial 550W Module', brand: 'Tier-1', price: '₹16,500', tag: 'Solar Module' },
  { name: '5 kW String Inverter', brand: 'Fronius / Solis', price: '₹32,000', tag: 'Inverter' },
  { name: 'GI Module Mounting Structure', brand: 'Garv-branded', price: '₹8,200/kW', tag: 'Structure' },
  { name: '10 kWh LFP Battery', brand: 'Dyness / BYD', price: '₹1,10,000', tag: 'Storage' },
]

function Shop() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Solar Shop — Phase 2</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Buy solar components<br />
              <em style={{ color: 'var(--ochre)' }}>directly from us.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Our e-commerce store for certified modules, inverters, structures and batteries is launching soon. Join the waitlist for early access and exclusive installer pricing.
            </p>
            {submitted ? (
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SunMark size={24} />
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--moss)', letterSpacing: '0.1em' }}>You're on the list — we'll be in touch!</p>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
                style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: '1 1 220px',
                    padding: '13px 16px',
                    border: '1px solid var(--rule)',
                    borderRadius: 999,
                    fontFamily: 'IBM Plex Sans',
                    fontSize: 14,
                    background: 'var(--bg)',
                    color: 'var(--ink)',
                    outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button type="submit" className="btn btn-primary">Join Waitlist</button>
              </form>
            )}
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {SHOP_PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <div style={{
                border: '1px solid var(--rule)',
                borderRadius: 16,
                padding: 24,
                background: 'var(--bg-warm)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Placeholder image area */}
                <div style={{
                  aspectRatio: '1',
                  background: 'var(--bg-deep)',
                  borderRadius: 10,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <SunMark size={40} />
                </div>
                <span className="tag-pill" style={{ marginBottom: 10, display: 'inline-block' }}>{p.tag}</span>
                <h3 style={{ fontFamily: 'Newsreader', fontSize: 18, lineHeight: 1.2, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--ink-mute)', marginBottom: 12 }}>{p.brand}</p>
                <p style={{ fontFamily: 'Newsreader', fontSize: 22, color: 'var(--ochre)' }}>{p.price}</p>
                <div style={{
                  position: 'absolute',
                  top: 12, right: 12,
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  background: 'var(--ochre)',
                  color: 'var(--bg)',
                  padding: '4px 8px',
                  borderRadius: 999,
                }}>
                  Coming Soon
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "Garv Urja handled our 200 kWp rooftop from survey to net-metering approval in under six weeks. Our electricity bill dropped by 80% from day one.",
    author: 'Rajesh Patel',
    role: 'Owner, Patel Agro Industries',
    location: 'Anand, Gujarat',
    initials: 'RP',
  },
  {
    quote: "Excellent workmanship and even better after-sales support. Three years in and our system still produces above the guaranteed yield. Worth every rupee.",
    author: 'Meena Shah',
    role: 'Director, Shah Cold Storage',
    location: 'Mehsana, Gujarat',
    initials: 'MS',
  },
  {
    quote: "We installed a 3 kWp system at home under PM Surya Ghar. The team made the subsidy process completely painless. Highly recommend Garv Urja.",
    author: 'Dilip Joshi',
    role: 'Homeowner',
    location: 'Vadodara, Gujarat',
    initials: 'DJ',
  },
]

function Testimonials() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <Reveal style={{ marginBottom: 'clamp(40px, 5vw, 72px)', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>What Clients Say</Eyebrow>
          <h2 className="h-section" style={{ marginTop: 16 }}>
            Trusted across Gujarat.
          </h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="max-md:grid-cols-1">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 80}>
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--rule)',
                borderRadius: 16,
                padding: 'clamp(24px, 3vw, 36px)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <div style={{ fontSize: 32, color: 'var(--ochre)', fontFamily: 'Newsreader', lineHeight: 1, marginBottom: 16 }}>"</div>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--ink-soft)', flexGrow: 1, marginBottom: 24 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--bg-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'IBM Plex Mono',
                    fontSize: 12,
                    color: 'var(--ink-mute)',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{t.author}</p>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>{t.role}</p>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ochre)', letterSpacing: '0.1em' }}>{t.location}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Jay Jangid',
    role: 'Founder & Managing Director',
    bio: 'Solar entrepreneur and GIDC Anand industry veteran with 15+ years in electrical engineering.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Raj Mehta',
    role: 'Head of Engineering',
    bio: 'BE Electrical, specialising in MW-scale plant design and grid-compliance engineering.',
    img: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Jaldeep Solanki',
    role: 'Operations & O&M Lead',
    bio: 'Manages our 80-person field team and remote monitoring operations across 500+ active sites.',
    img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Harshad Prajapati',
    role: 'Sales & Liaisoning',
    bio: 'DISCOM and government-scheme expert; ensures every client maximises available subsidies.',
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop',
  },
]

function Team() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head" style={{ marginBottom: 'clamp(40px, 5vw, 72px)' }}>
          <Reveal>
            <Eyebrow>The People</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Faces behind the watts.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Our multidisciplinary team of engineers, electricians and project managers brings decades of combined solar experience to every installation.
            </p>
          </Reveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 70}>
              <article>
                <ImgPh
                  src={m.img}
                  alt={m.name}
                  style={{ aspectRatio: '3/4', borderRadius: 16, marginBottom: 20 }}
                />
                <h3 style={{ fontFamily: 'Newsreader', fontSize: 20, marginBottom: 4 }}>{m.name}</h3>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ochre)', marginBottom: 10 }}>{m.role}</p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{m.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  { q: 'What is the PM Surya Ghar subsidy and am I eligible?', a: 'The PM Surya Ghar Muft Bijli Yojana provides a central government subsidy of up to ₹78,000 for residential rooftop solar up to 3 kW, and ₹1,08,000 for 3–10 kW systems. Any homeowner with a valid electricity connection is eligible. We handle the entire application process on your behalf.' },
  { q: 'How long does installation typically take?', a: 'For a standard 3–10 kWp residential system, installation takes 3–5 working days once materials are delivered. Larger commercial or industrial systems (50–500 kWp) typically take 2–6 weeks. Net-metering approval from DISCOM may add 2–4 weeks post-installation.' },
  { q: 'What happens to my system during a power cut?', a: 'On-grid systems automatically shut down during grid outages for safety (anti-islanding protection). If you want backup power, we recommend a hybrid inverter with battery storage — we offer complete hybrid and off-grid solutions using LFP battery banks.' },
  { q: 'What warranty do you provide on the system?', a: 'We provide a 5-year comprehensive workmanship warranty. Modules carry a 25-year power output warranty from the manufacturer. Inverters typically carry 5–10 year warranties. Our O&M contracts extend your coverage with periodic audits and rapid-response support.' },
  { q: "Can solar panels withstand Gujarat's extreme summers and monsoon?", a: "Yes — quality solar modules are tested to IEC 61215 and IEC 61730 standards, which include temperature cycling, humidity, UV, hail and wind load tests. Our mounting structures are designed for Gujarat's wind zones (Vz 39–44 m/s). We've had zero structural failures across 13+ years." },
  { q: 'Is Garv Urja Solar a government-approved channel partner?', a: 'Yes, we are a MNRE-approved EPC company and GUVNL-empanelled vendor. We are registered under PM Surya Ghar and can process subsidy applications directly through the national portal on behalf of our clients.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Questions, answered.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Can't find what you're looking for? Drop us a message and we'll get back to you within a working day.
            </p>
          </Reveal>
        </div>

        <div style={{ maxWidth: 800 }}>
          {FAQS.map((item, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{item.q}</span>
                  <Plus open={open === i} />
                </button>
                <div className={`faq-answer${open === i ? ' open' : ''}`}>
                  {item.a}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'residential', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="section-pad contact-section">
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 96px)' }} className="max-md:grid-cols-1">
          {/* Left: info */}
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="h-section" style={{ color: 'var(--bg)', marginTop: 16, marginBottom: 32 }}>
              Let's build something that lasts 25 years.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: 'Address', value: 'Vitthal Udhyog Nagar GIDC, Anand, Gujarat — 388 001' },
                { label: 'Phone', value: '02692 234 776\n+91 93138 04410' },
                { label: 'Email', value: 'info@jsepl.in' },
                { label: 'CIN', value: 'U40300GJ2011PTC\nISO 9001:2015 Certified' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 45%, transparent)', marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'color-mix(in oklch, var(--bg) 85%, transparent)', whiteSpace: 'pre-line' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{
              marginTop: 36,
              height: 160,
              background: 'color-mix(in oklch, var(--bg) 8%, transparent)',
              border: '1px solid color-mix(in oklch, var(--bg) 14%, transparent)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
              <SunMark size={24} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'color-mix(in oklch, var(--bg) 40%, transparent)', letterSpacing: '0.12em' }}>GIDC Anand, Gujarat</span>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={120}>
            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, paddingTop: 40 }}>
                <SunMark size={48} />
                <h3 className="h-card" style={{ color: 'var(--bg)' }}>Thank you, {form.name}!</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'color-mix(in oklch, var(--bg) 70%, transparent)' }}>
                  We've received your enquiry and will get back to you within one working day. If it's urgent, call us at +91 93138 04410.
                </p>
                <button
                  className="btn"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: 8, background: 'var(--ochre)', color: 'var(--bg)', borderColor: 'var(--ochre)' }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontFamily: 'Newsreader', fontSize: 24, color: 'var(--bg)', marginBottom: 8 }}>Send an Enquiry</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 50%, transparent)', display: 'block', marginBottom: 6 }}>Name *</label>
                    <input required name="name" value={form.name} onChange={handle} placeholder="Your name" className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 50%, transparent)', display: 'block', marginBottom: 6 }}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 00000" className="form-input" />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 50%, transparent)', display: 'block', marginBottom: 6 }}>Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" className="form-input" />
                </div>

                <div>
                  <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 50%, transparent)', display: 'block', marginBottom: 6 }}>Project Type</label>
                  <select name="type" value={form.type} onChange={handle} className="form-input" style={{ cursor: 'pointer' }}>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="om">O&M / AMC</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 50%, transparent)', display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handle}
                    placeholder="Tell us about your site and requirements…"
                    rows={4}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-arrow" style={{ background: 'var(--ochre)', color: 'var(--bg)', borderColor: 'var(--ochre)', alignSelf: 'flex-start', marginTop: 4 }}>
                  Send Enquiry
                </button>

                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'color-mix(in oklch, var(--bg) 35%, transparent)', lineHeight: 1.6 }}>
                  We respond within 1 working day · Your data is never shared
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--bg)', padding: 'clamp(48px, 7vw, 96px) 0 32px' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 56, borderBottom: '1px solid color-mix(in oklch, var(--bg) 12%, transparent)' }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ochre)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bg)', fontWeight: 500 }}>Garv Urja Solar</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: 'color-mix(in oklch, var(--bg) 55%, transparent)', maxWidth: 280, marginBottom: 20 }}>
              Gujarat's trusted solar EPC company. Designing, building and maintaining clean energy systems since 2011.
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', color: 'color-mix(in oklch, var(--bg) 35%, transparent)' }}>
              CIN: U40300GJ2011PTC<br />
              ISO 9001:2015 Certified
            </p>
          </div>

          {/* Services */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginBottom: 16 }}>Services</p>
            {['Rooftop Solar', 'Ground-Mount EPC', 'O&M / AMC', 'Solar Pumps', 'Battery Storage'].map(l => (
              <a key={l} href="#services" style={{ display: 'block', fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'color-mix(in oklch, var(--bg) 65%, transparent)')}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginBottom: 16 }}>Company</p>
            {['About', 'Projects', 'Team', 'FAQ', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: 'block', fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'color-mix(in oklch, var(--bg) 65%, transparent)')}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 40%, transparent)', marginBottom: 16 }}>Get In Touch</p>
            <p style={{ fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', lineHeight: 1.6, marginBottom: 12 }}>
              Vitthal Udhyog Nagar GIDC,<br />Anand, Gujarat 388 001
            </p>
            <a href="tel:+919313804410" style={{ display: 'block', fontSize: 14, color: 'color-mix(in oklch, var(--bg) 65%, transparent)', textDecoration: 'none', marginBottom: 6 }}>+91 93138 04410</a>
            <a href="mailto:info@jsepl.in" style={{ display: 'block', fontSize: 14, color: 'var(--ochre)', textDecoration: 'none' }}>info@jsepl.in</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', color: 'color-mix(in oklch, var(--bg) 35%, transparent)' }}>
            © {new Date().getFullYear()} Garv Urja Solar Pvt. Ltd. All rights reserved.
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Process />
        <Calculator />
        <Projects />
        <Impact />
        <Shop />
        <Testimonials />
        <Team />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
