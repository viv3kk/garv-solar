'use client'

import { Eyebrow, Counter } from '../../_shared'

const HERO_METRICS = [
  { value: 1000, suffix: '+', label: 'kW Commissioned' },
  { value: 100, suffix: '+', label: 'Installations' },
  { value: 50000, suffix: '', label: 'Tonnes CO₂ Avoided' },
  { value: 10, suffix: 'Cr+', label: 'Client Savings ₹' },
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

export default function Hero() {
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
            <Eyebrow>MNRE Registered · Serving All of India</Eyebrow>
            <h1 className="h-display" style={{ marginTop: 20, marginBottom: 24 }}>
              Power your world<br />
              <em style={{ color: 'var(--ochre)' }}>with the sun.</em>
            </h1>
            <p className="lede" style={{ maxWidth: 460, marginBottom: 36 }}>
              Garv Urja Solutions designs, installs and maintains rooftop and ground-mount solar systems for homes, industries and utilities across India.
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
              }}>Solar across India</span>
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
