'use client'

import { useState } from 'react'
import { Eyebrow, Plus, SunMark, ImgPh, Reveal, Counter, Nav, Footer } from '../_shared'

// ─── Data ──────────────────────────────────────────────────────────────────

const WHY_US = [
  {
    title: 'Savings, in writing.',
    body: 'Every quote ships with a year-by-year savings projection. We design to your bill, not a sales target — so what we promise on paper shows up on your monthly statement.',
    tag: 'Transparent pricing',
  },
  {
    title: 'Built for Indian weather.',
    body: 'Galvanised structures rated for 170 km/h cyclone-zone winds, anti-soiling Tier-1 panels, and a 15° tilt that helps monsoon rain wash off pollution, dust and pollen.',
    tag: 'India-grade engineering',
  },
  {
    title: 'One team, end to end.',
    body: 'Site survey, 3D design, PM Surya Ghar paperwork, DISCOM net-metering, installation, commissioning, and 5-year AMC — same project manager from quote to year 25.',
    tag: 'No middlemen',
  },
  {
    title: 'Real-time monitoring.',
    body: 'Wi-Fi inverter + mobile app shows live generation, monthly savings in ₹, and alerts the moment a panel underperforms — usually before you notice.',
    tag: 'Visibility, daily',
  },
]

const PACKAGES = [
  {
    size: '1 kW',
    bills: '₹1,500–₹2,500 / month',
    daily: '4–5 units/day',
    roof: '~ 100 sq ft',
    indicative: '₹65,000',
    afterSubsidy: '₹35,000',
    bestFor: '1–2 BHK · 2–3 fans, fridge, lights',
  },
  {
    size: '3 kW',
    bills: '₹3,500–₹6,000 / month',
    daily: '12–15 units/day',
    roof: '~ 280 sq ft',
    indicative: '₹1,85,000',
    afterSubsidy: '₹1,07,000',
    bestFor: '3 BHK · AC, washing machine, geyser',
    popular: true,
  },
  {
    size: '5 kW',
    bills: '₹6,000–₹10,000 / month',
    daily: '20–25 units/day',
    roof: '~ 450 sq ft',
    indicative: '₹2,95,000',
    afterSubsidy: '₹2,17,000',
    bestFor: 'Large home · 2+ ACs, EV charger',
  },
  {
    size: '10 kW',
    bills: '₹12,000+ / month',
    daily: '40–50 units/day',
    roof: '~ 900 sq ft',
    indicative: '₹5,70,000',
    afterSubsidy: '₹4,92,000',
    bestFor: 'Villa or home-office · heavy load',
  },
]

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Free home visit',
    body: 'Our engineer measures your roof, runs shadow analysis, and reviews 12 months of bills to size the system correctly.',
    duration: '90 minutes',
  },
  {
    n: '02',
    title: 'Personalised 3D design',
    body: 'Within 48 hours we share a 3D render showing exactly how the array sits on your roof, with a year-by-year savings model.',
    duration: '48 hours',
  },
  {
    n: '03',
    title: 'Subsidy + financing',
    body: 'We file your PM Surya Ghar application, arrange a 0% EMI loan if you want one, and handle every government form.',
    duration: '2–3 weeks',
  },
  {
    n: '04',
    title: 'Installation in a day',
    body: 'A factory-trained 4-person crew installs and commissions your system in 1–2 days, with full safety harness and roof protection.',
    duration: '1–2 days',
  },
  {
    n: '05',
    title: 'Net meter + go live',
    body: 'We coordinate the DISCOM inspection and net-meter swap. Your system goes live and the savings begin.',
    duration: '2–4 weeks',
  },
  {
    n: '06',
    title: 'Free 5-year AMC',
    body: 'Quarterly cleaning, monthly remote audits, and 48-hour on-site response for the first 5 years — at no extra cost.',
    duration: 'Years 1–5',
  },
]

const MYTHS = [
  {
    myth: 'Solar only works in summer.',
    reality:
      'Panels actually peak in cool, sunny weather — March and October are often the best months. Annual estimates already model monsoon and winter dips, and the system pays back across the whole year.',
  },
  {
    myth: 'My roof is too small.',
    reality:
      'Modern 540 W panels need just 28 sq ft each. A 3 kW system fits on ~280 sq ft — most Indian homes have enough usable area. We confirm with a free site survey.',
  },
  {
    myth: "I'll need to maintain it like a car.",
    reality:
      'No moving parts means almost no maintenance. Wipe the panels twice a month with water; the rest is covered by your AMC. Inverters are the only component that may need swapping at year 12–15.',
  },
  {
    myth: 'The subsidy paperwork is a nightmare.',
    reality:
      "It's not — for us. We file your PM Surya Ghar application on the national portal, coordinate DISCOM inspection, and chase the subsidy disbursement. You sign two forms and that's it.",
  },
  {
    myth: "It'll damage my roof.",
    reality:
      "Properly installed, no. We use non-penetrating ballasted mounts where possible and chemically anchored fixings with engineered waterproofing where not. You get a written 10-year structure warranty.",
  },
  {
    myth: 'Lithium batteries are dangerous on the roof.',
    reality:
      'For on-grid systems, no batteries are needed — you use the grid as your "battery". Hybrid systems use LiFePO₄ chemistry (the same as e-scooters) with thermal protection. We install them in a ventilated indoor enclosure, not on the roof.',
  },
]

const FAQS = [
  {
    q: 'How much can I really save on my electricity bill?',
    a: 'Most home customers cut their monthly bill by 80–95% from day one. A ₹4,000/month bill typically falls below ₹500. Because Indian state electricity tariffs have historically risen ~4% annually, your effective savings compound year after year.',
  },
  {
    q: 'How much does a 3 kW home system cost in India in 2026?',
    a: 'Approximately ₹1.75–1.95 lakh installed, with Tier-1 panels and a Tier-1 inverter — varies slightly by state, brand and roof complexity. The PM Surya Ghar central subsidy of ₹78,000 (plus state top-ups where applicable) brings your net cost to ₹1.0–1.2 lakh. Many customers finance the remainder on a 5-year EMI that costs less than their old bill.',
  },
  {
    q: 'How does the ₹78,000 subsidy actually work?',
    a: 'It is credited directly to your bank account within 30 days of commissioning. We register you on the National Portal, file the DISCOM application, coordinate inspection, and follow up until the money lands. You do nothing.',
  },
  {
    q: 'Will my system work during a power cut?',
    a: 'A standard on-grid system shuts off during a blackout (a safety regulation). If you want backup during outages, we can design a hybrid system with a lithium battery — typical add-on cost is ₹70,000–₹1,20,000 for 4–8 hours of essential-load backup.',
  },
  {
    q: 'How long will my system last?',
    a: 'Panels are warrantied for 25 years at ≥85% output and typically perform for 30+. Inverters last 10–15 years and may need one replacement. With Garv\'s AMC, we monitor performance continuously and replace failing components under warranty at no charge.',
  },
  {
    q: 'What if I sell my house?',
    a: 'Solar increases resale value — a Saur Energy / ICICI Bank analysis pegs the typical Indian home premium at 3–5%. The system stays with the property and the new owner inherits the warranty and AMC.',
  },
]

// ─── Sections ──────────────────────────────────────────────────────────────

// ─── Hero feature icons ────────────────────────────────────────────────────

function IconSun() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <circle cx="15" cy="15" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <line
          key={deg}
          x1="15" y1="3.5" x2="15" y2="6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          transform={`rotate(${deg} 15 15)`}
        />
      ))}
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M15 4 L25 7.5 V14.5 C25 20 20.5 24 15 26 C9.5 24 5 20 5 14.5 V7.5 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 15 L14 18 L19 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconRupee() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <circle cx="15" cy="15" r="11" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 9.5 H19 M11 12.5 H19 M11 9.5 C16 9.5 16 16 11 16 H14 L19.5 21.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconHouse() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M5 14 L15 5 L25 14 V24 H19 V17 H11 V24 H5 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconHeadset() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M5 17 V14 C5 8.5 9.5 4.5 15 4.5 C20.5 4.5 25 8.5 25 14 V17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="4" y="16" width="4.5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="21.5" y="16" width="4.5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M21.5 24 V25 C21.5 26.4 20.4 27.5 19 27.5 H16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.5" cy="27.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

const HERO_FEATURES: { icon: React.ReactNode; title: string; sub: string }[] = [
  { icon: <IconSun />, title: 'Save up to 95%', sub: 'on electricity bills' },
  { icon: <IconShield />, title: '5-year free', sub: 'maintenance' },
  { icon: <IconRupee />, title: '₹78,000 subsidy', sub: 'under PM Surya Ghar' },
  { icon: <IconHouse />, title: 'Increase property', sub: 'value' },
  { icon: <IconHeadset />, title: 'Lifetime support', sub: 'you can trust' },
]

function HomeSolarHero() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(640px, 96svh, 900px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: 'clamp(96px, 12vh, 140px)',
        paddingBottom: 'clamp(28px, 4vw, 48px)',
        background: 'var(--ink)',
        isolation: 'isolate',
      }}
    >
      {/* Background image — full bleed */}
      <img
        src="/images/home-solar-hero.png"
        alt="Indian family on a rooftop with solar panels at sunset"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center right',
          zIndex: -2,
        }}
      />

      {/* Cream-to-clear gradient on the left for text legibility */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: `
            linear-gradient(105deg,
              color-mix(in oklch, var(--bg-warm) 90%, transparent) 0%,
              color-mix(in oklch, var(--bg-warm) 80%, transparent) 18%,
              color-mix(in oklch, var(--bg-warm) 50%, transparent) 36%,
              color-mix(in oklch, var(--bg-warm) 18%, transparent) 52%,
              transparent 68%
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Soft bottom gradient so the glass bar reads cleanly */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.18) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-site" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {/* Headline + CTA — pinned to upper-left */}
        <div
          style={{
            maxWidth: 620,
            animation: 'fade-in 0.85s ease both',
            animationDelay: '0.1s',
            marginBottom: 'clamp(40px, 8vw, 110px)',
          }}
        >
          <h1
            className="h-display"
            style={{
              fontSize: 'clamp(38px, 5.4vw, 80px)',
              lineHeight: 1.04,
              color: 'var(--ink)',
              marginBottom: 28,
              textShadow: '0 1px 1px rgba(255,250,240,0.4)',
            }}
          >
            More than<br />
            sunlight.<br />
            It&rsquo;s your{' '}
            <em style={{ color: 'var(--ochre-deep)', fontStyle: 'italic' }}>peace of mind.</em>
          </h1>

          {/* Decorative ochre rule */}
          <div
            style={{
              width: 64,
              height: 2,
              background: 'var(--ochre-deep)',
              marginBottom: 22,
              borderRadius: 2,
            }}
          />

          <p
            style={{
              fontSize: 'clamp(15px, 1.15vw, 17px)',
              lineHeight: 1.6,
              color: 'var(--ink-soft)',
              maxWidth: 460,
              marginBottom: 32,
            }}
          >
            Clean energy. Lower bills. Energy independence.<br />
            A smarter investment for your family and<br />
            a better tomorrow for generations to come.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/#contact" className="btn btn-primary btn-arrow">
              Book a free site visit
            </a>
            <a href="/#calculator" className="btn btn-ghost">
              Estimate my savings
            </a>
          </div>
        </div>

        {/* Liquid-glass benefits bar — pinned to bottom */}
        <div
          className="liquid-glass-bar"
          style={{
            animation: 'fade-in 1s ease both',
            animationDelay: '0.4s',
          }}
        >
          <div className="liquid-glass-grid">
            {HERO_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="hero-feature"
                data-first={i === 0 ? '1' : '0'}
              >
                <span aria-hidden className="hero-feature-icon">
                  {f.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p className="hero-feature-title">{f.title}</p>
                  <p className="hero-feature-sub">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ImpactBand() {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--bg)', padding: 'clamp(40px, 6vw, 64px) 0' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {[
            { v: 100, s: '+', l: 'Homes solarised' },
            { v: 1000, s: '+ kW', l: 'Total commissioned' },
            { v: 85, s: '%', l: 'Average bill cut' },
            { v: 25, s: ' yrs', l: 'Designed life' },
          ].map(({ v, s, l }) => (
            <Reveal key={l}>
              <div style={{ paddingBlock: 16 }}>
                <div style={{ fontFamily: 'Newsreader', fontSize: 'clamp(38px, 4vw, 56px)', lineHeight: 1, marginBottom: 8 }}>
                  <Counter target={v} suffix={s} />
                </div>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 55%, transparent)' }}>
                  {l}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Why Garv for your home</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              The boring, reliable kind of solar company.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              No sales theatre, no "this week only" pricing. Local engineers, written savings projections,
              and the same project manager from quote through year-25 service.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 3vw, 40px)' }} className="max-md:grid-cols-1">
          {WHY_US.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <article style={{
                padding: 'clamp(28px, 3vw, 40px)',
                background: 'var(--bg-warm)',
                border: '1px solid var(--rule)',
                borderRadius: 16,
                height: '100%',
              }}>
                <span className="tag-pill">{card.tag}</span>
                <h3 className="h-card" style={{ marginTop: 16, marginBottom: 12 }}>{card.title}</h3>
                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.65, fontSize: 15 }}>{card.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Packages() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Pick your size</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              From single floors to villas.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Indicative pan-India pricing for May 2026. Final quotes vary 5–10% by state, brand selection,
              roof geometry, and DISCOM zone — your free site visit gives you exact numbers.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.size} delay={i * 60}>
              <article style={{
                padding: 24,
                background: 'var(--bg)',
                border: p.popular ? '1.5px solid var(--ochre)' : '1px solid var(--rule)',
                borderRadius: 16,
                height: '100%',
                position: 'relative',
              }}>
                {p.popular && (
                  <span style={{
                    position: 'absolute', top: -10, left: 24,
                    background: 'var(--ochre)', color: 'var(--ink)',
                    fontFamily: 'IBM Plex Mono', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 999, fontWeight: 500,
                  }}>
                    Most popular
                  </span>
                )}
                <div style={{ fontFamily: 'Newsreader', fontSize: 40, lineHeight: 1, marginBottom: 4 }}>{p.size}</div>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 20 }}>
                  {p.bills}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {[
                    { label: 'Generates', value: p.daily },
                    { label: 'Roof needed', value: p.roof },
                    { label: 'Indicative price', value: p.indicative },
                    { label: 'After subsidy', value: p.afterSubsidy, accent: true },
                  ].map(item => (
                    <li key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--rule)' }}>
                      <span style={{ color: 'var(--ink-mute)' }}>{item.label}</span>
                      <span style={{ color: item.accent ? 'var(--ochre-deep)' : 'var(--ink)', fontWeight: item.accent ? 500 : 400 }}>{item.value}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{p.bestFor}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <p style={{ marginTop: 32, fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em' }}>
          Prices include Tier-1 panels, inverter, structures, cabling, net metering and installation. GST extra at 13.8%.
        </p>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Six steps to <em style={{ color: 'var(--ochre)' }}>solar on</em>.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              From "I'm curious" to "the meter is spinning backwards" — typically 4 to 6 weeks, mostly
              spent waiting on the DISCOM, not us.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(20px, 2.5vw, 32px)' }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 50}>
              <div style={{
                padding: 'clamp(24px, 2.5vw, 32px)',
                background: 'var(--bg-warm)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
                height: '100%',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.16em', color: 'var(--ochre-deep)' }}>{step.n}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{step.duration}</span>
                </div>
                <h3 className="h-card" style={{ marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function MythBuster() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Myth vs reality</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              The chai-shop wisdom we hear most.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Six things every prospective customer mentions on the first call — and what's actually true
              about each one.
            </p>
          </Reveal>
        </div>

        <div style={{ maxWidth: 880 }}>
          {MYTHS.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={i} delay={i * 30}>
                <div className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--clay)' }}>Myth</span>
                      <span style={{ fontStyle: 'italic' }}>"{item.myth}"</span>
                    </span>
                    <Plus open={isOpen} />
                  </button>
                  <div className={`faq-answer${isOpen ? ' open' : ''}`} style={isOpen ? { maxHeight: 280 } : undefined}>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--moss-deep)', display: 'block', marginBottom: 8 }}>Reality</span>
                    {item.reality}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SavingsExample() {
  return (
    <section className="section-pad calc-section">
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center' }}
          className="max-md:grid-cols-1">
          <Reveal>
            <Eyebrow>One household, 25 years</Eyebrow>
            <h2 className="h-section" style={{ color: 'var(--bg)', marginTop: 16, marginBottom: 20 }}>
              ₹15.4 lakh saved over 25 years.
            </h2>
            <p style={{ color: 'color-mix(in oklch, var(--bg) 70%, transparent)', maxWidth: 480, lineHeight: 1.65, marginBottom: 32 }}>
              A typical Indian family with a ₹4,500/month bill installs a 3 kW system. With PM Surya Ghar
              subsidy, ₹78,000 is back in their account in 30 days. Payback in year 4. After that:
              two decades of nearly free power.
            </p>
            <a href="/#calculator" className="btn btn-primary btn-arrow" style={{ background: 'var(--ochre)', color: 'var(--ink)' }}>
              Try the calculator
            </a>
          </Reveal>
          <Reveal delay={120}>
            <div style={{
              padding: 'clamp(28px, 3vw, 40px)',
              background: 'color-mix(in oklch, var(--bg) 8%, transparent)',
              border: '1px solid color-mix(in oklch, var(--bg) 18%, transparent)',
              borderRadius: 16,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { l: 'Old bill (monthly)', v: '₹4,500' },
                  { l: 'New bill (monthly)', v: '< ₹400', accent: true },
                  { l: 'System cost', v: '₹1.85 L' },
                  { l: 'Subsidy back', v: '– ₹78,000' },
                  { l: 'Net investment', v: '₹1.07 L', accent: true },
                  { l: 'Payback', v: '~ 3.8 years' },
                  { l: 'Year 25 savings', v: '₹15.4 L', accent: true },
                ].map(row => (
                  <div key={row.l} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    paddingBlock: 8,
                    borderBottom: '1px solid color-mix(in oklch, var(--bg) 14%, transparent)',
                  }}>
                    <span style={{ color: 'color-mix(in oklch, var(--bg) 65%, transparent)', fontSize: 14 }}>{row.l}</span>
                    <span style={{
                      fontFamily: 'Newsreader',
                      fontSize: row.accent ? 24 : 18,
                      color: row.accent ? 'var(--ochre)' : 'var(--bg)',
                    }}>{row.v}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 18, fontSize: 11, color: 'color-mix(in oklch, var(--bg) 45%, transparent)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em' }}>
                Assumes 4% annual tariff hike; 0.5% panel degradation/yr; average Indian residential slab.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Customers() {
  const stories = [
    {
      img: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80&auto=format&fit=crop',
      name: 'Rajeev & Sunita Sharma',
      area: 'Indore · 3 kW system',
      quote:
        'Bill dropped from ₹4,800 to ₹360 in the first month. Garv handled every paper — we just signed where they pointed. Two summers later, the app still shows steady generation.',
    },
    {
      img: 'https://images.unsplash.com/photo-1605457212915-2c8e35d8e1f3?w=900&q=80&auto=format&fit=crop',
      name: 'Dr. Manoj Yadav',
      area: 'Pune · 5 kW system',
      quote:
        'I run a clinic on the ground floor and live above. The 5 kW carries both. Pure quality of installation — even the DISCOM inspector commented on how clean the cabling was.',
    },
    {
      img: 'https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=900&q=80&auto=format&fit=crop',
      name: 'Ayesha Khan',
      area: 'Bengaluru · 3 kW system',
      quote:
        'Wanted a contractor who would still pick up the phone in year three. So far they have, and the quarterly cleanings actually happen on schedule.',
    },
  ]
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Homes we've solarised</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Real bills, real numbers, real neighbours.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Every story below comes with a verifiable bill statement and a working installation our crew
              still services today.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(20px, 2.5vw, 32px)' }} className="max-md:grid-cols-1">
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={i * 80}>
              <article style={{
                background: 'var(--bg-warm)',
                border: '1px solid var(--rule)',
                borderRadius: 16,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                  <ImgPh src={s.img} tag={s.area} style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: 'Newsreader', fontSize: 18, lineHeight: 1.45, color: 'var(--ink)', fontStyle: 'italic', marginBottom: 18 }}>
                    "{s.quote}"
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                    <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{s.name}</p>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 4 }}>{s.area}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqStrip() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Top questions</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              The big six — answered.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              For the full list, head to our dedicated <a href="/faqs" style={{ color: 'var(--ochre-deep)', textDecoration: 'underline', textUnderlineOffset: 3 }}>FAQs page</a> — 50+ questions across eight categories.
            </p>
          </Reveal>
        </div>

        <div style={{ maxWidth: 880 }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={i} delay={i * 30}>
                <div className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  >
                    <span>{item.q}</span>
                    <Plus open={isOpen} />
                  </button>
                  <div className={`faq-answer${isOpen ? ' open' : ''}`} style={isOpen ? { maxHeight: 280 } : undefined}>
                    {item.a}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="section-pad" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center' }} className="max-md:grid-cols-1">
          <Reveal>
            <SunMark size={48} />
            <h2 className="h-section" style={{ color: 'var(--bg)', marginTop: 24, marginBottom: 20 }}>
              Free site visit. <em style={{ color: 'var(--ochre)' }}>Honest numbers.</em>
            </h2>
            <p style={{ color: 'color-mix(in oklch, var(--bg) 72%, transparent)', maxWidth: 540, lineHeight: 1.6, marginBottom: 32 }}>
              Share your last 3 electricity bills and a rooftop photo. We'll come back with a preliminary
              savings number within 24 hours, followed by a free on-site survey. No obligation, no pressure.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/#contact" className="btn btn-primary btn-arrow" style={{ background: 'var(--ochre)', color: 'var(--ink)' }}>
                Get my free quote
              </a>
              <a href="https://wa.me/918810405990" className="btn btn-ghost" style={{ borderColor: 'var(--bg)', color: 'var(--bg)' }}>
                WhatsApp us
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'MNRE-registered EPC vendor',
                'DISCOM-empanelled across Indian states',
                'Tier-1 panels, BIS-certified inverters',
                '170 km/h wind-rated structures',
                '25-year linear performance warranty',
                'Free 5-year AMC with quarterly cleaning',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'color-mix(in oklch, var(--bg) 85%, transparent)', fontSize: 15 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomeSolarPage() {
  return (
    <>
      <Nav />
      <main>
        <HomeSolarHero />
        <ImpactBand />
        <WhyUs />
        <Packages />
        <Process />
        <MythBuster />
        <SavingsExample />
        <Customers />
        <FaqStrip />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
