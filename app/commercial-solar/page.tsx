'use client'

import { useState } from 'react'
import { Eyebrow, Plus, SunMark, ImgPh, Reveal, Counter, Nav, Footer } from '../_shared'

// ─── Data ──────────────────────────────────────────────────────────────────

const SECTORS = [
  {
    name: 'Manufacturing',
    body: 'Auto components, textile mills, plastic and steel — high daytime load profiles where solar offsets the most expensive industrial tariff slabs.',
    typical: '100 kW – 5 MW',
    img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Warehousing & logistics',
    body: 'Large clean roofs, predictable load, and good DISCOM rates make warehouses the highest-IRR site type we install on.',
    typical: '500 kW – 3 MW',
    img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Hotels & hospitality',
    body: '24/7 operations, refrigeration, AC and laundry loads. Hybrid systems with battery backup hedge against both tariff hikes and outages.',
    typical: '50 kW – 1 MW',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Education',
    body: 'Schools, colleges and coaching campuses run peak daytime — the perfect match for solar. ESG-positive and protects long-term operating budgets.',
    typical: '30 kW – 500 kW',
    img: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Healthcare',
    body: 'Hospitals and diagnostic centres need power reliability above all. Hybrid solar + battery delivers both savings and uptime through grid outages.',
    typical: '100 kW – 2 MW',
    img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Agri & cold storage',
    body: 'Cold-storage units, dairies, and food-processing plants — high tariff exposure makes them prime candidates for both grid-tied and captive solar.',
    typical: '50 kW – 1 MW',
    img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&q=80&auto=format&fit=crop',
  },
]

const MODELS = [
  {
    name: 'CAPEX',
    headline: 'You own the system.',
    body:
      'You pay the upfront capex and capture the full upside: 40% accelerated depreciation in year 1, GST input credit, and every unit of savings for 25 years. Equity IRRs of 25–35% are typical for well-designed systems.',
    pros: ['Highest 25-year return', 'Accelerated depreciation', 'GST input credit', 'Full ownership of asset'],
    cons: ['Upfront capital required', 'You manage performance'],
    bestFor: 'Profitable businesses with available capital and a tax appetite',
    tag: 'Best long-term return',
  },
  {
    name: 'OPEX / PPA',
    headline: 'A developer owns it, you buy the units.',
    body:
      'A renewable energy service company (RESCO) finances, installs and operates the system on your roof. You sign a 15–25 year Power Purchase Agreement to buy electricity at ₹4–6/unit (vs the grid\'s ₹9–14/unit). Zero capex, savings from day one.',
    pros: ['Zero upfront capex', 'Savings from day 1', 'Performance risk on developer', 'No O&M headache'],
    cons: ['Lower lifetime return', 'Long-term contract', 'No depreciation benefit'],
    bestFor: 'Companies preserving cash, or with limited tax appetite',
    tag: 'Zero capex',
  },
  {
    name: 'Hybrid / Lease-buyout',
    headline: 'Start opex, switch to capex later.',
    body:
      'Begin under an OPEX contract — preserve cash, lock in savings. After year 5 or 7, exercise a pre-agreed buyout clause to take full ownership at a discounted residual value. Best of both worlds.',
    pros: ['Flexible cash flow', 'Switch to ownership at buyout', 'Defers capex decision'],
    cons: ['Buyout pricing locked early', 'Slightly higher overall cost'],
    bestFor: 'Mid-size businesses unsure of long-term plans',
    tag: 'Flexible',
  },
]

const BENEFITS = [
  {
    title: 'Slash power costs by 50–80%.',
    body: 'Indian industrial tariffs run ₹8–12/unit depending on state. Solar lands at ₹2.5–4/unit over 25 years — and stays flat while grid costs keep rising.',
    n: '01',
  },
  {
    title: '3–5 year payback.',
    body: 'With accelerated depreciation and GST input credit, a CAPEX system pays back in 36–60 months. Then 20+ years of pure return.',
    n: '02',
  },
  {
    title: 'Hedge against tariff hikes.',
    body: 'Indian industrial tariffs have risen 4–6% annually for the last decade. Solar locks your effective rate at today\'s number for two decades.',
    n: '03',
  },
  {
    title: 'Strengthen ESG and BRSR reporting.',
    body: 'Scope-2 emissions reduction, RPO compliance, and verifiable green-energy certificates — the documentation your investors, customers and auditors want.',
    n: '04',
  },
  {
    title: 'Tax-efficient asset.',
    body: '40% accelerated depreciation in year 1 + GST ITC + Section 80-IA benefits where applicable. Effective post-tax payback is often 1–2 years shorter than headline.',
    n: '05',
  },
  {
    title: 'Brand & employee story.',
    body: '"We run on solar" is a recruiting line, a customer line, and a procurement-tender line. Especially if you sell to multinationals with Scope-3 mandates.',
    n: '06',
  },
]

// Phase 02 hidden for now via { hidden: true } — easy to re-enable by flipping
// the flag. The page renders only visible phases and re-numbers them
// sequentially so users see 01..05 without a gap.
type Phase = {
  title: string
  duration: string
  points: string[]
  hidden?: boolean
}

const PROCESS: Phase[] = [
  {
    title: 'Feasibility & energy audit',
    duration: 'Week 1',
    points: [
      'Roof structural inspection (RCC / metal sheet / asbestos)',
      'Shadow analysis and tilt optimisation',
      'Load profile & tariff slab review',
      'Site-specific generation forecast',
    ],
  },
  {
    title: 'Technical & commercial design',
    duration: 'Week 2',
    points: [
      'Single-line diagram and structural drawings',
      'CAPEX / OPEX / lease modelling with IRR',
      'Subsidy and incentive mapping',
      'Detailed BOQ with Tier-1 component options',
    ],
    hidden: true,
  },
  {
    title: 'Approvals & financing',
    duration: 'Weeks 3–5',
    points: [
      'CEIG / DISCOM application filing',
      'Net metering or open access registration',
      'Bank coordination for term loans (if CAPEX)',
      'PPA structuring (if OPEX)',
    ],
  },
  {
    title: 'Procurement & EPC',
    duration: 'Weeks 4–10',
    points: [
      'Tier-1 panels & ALMM-listed inverters',
      'Galvanised mounting structures (170 km/h rated)',
      'Cable trays, earthing, lightning arrestors',
      'Quality checks at every milestone',
    ],
  },
  {
    title: 'Commissioning & handover',
    duration: 'Week 11',
    points: [
      'String testing & IV-curve verification',
      'CEIG inspection and approval',
      'Net-meter installation and grid sync',
      'Owner training, drawings, warranty pack',
    ],
  },
  {
    title: 'O&M for 25 years',
    duration: 'Ongoing',
    points: [
      'Remote monitoring & monthly performance reports',
      'Quarterly cleaning and IV testing',
      'Annual thermal imaging inspection',
      'Guaranteed PR (Performance Ratio) clauses',
    ],
  },
]

const VISIBLE_PHASES = PROCESS
  .filter(p => !p.hidden)
  .map((p, i) => ({ ...p, n: `Phase 0${i + 1}` }))

const FAQS = [
  {
    q: 'Why is commercial solar a better investment than fixed deposits or bonds?',
    a: 'Post-tax IRR on commercial solar typically runs 18–28% over 25 years — 4–6x higher than corporate FDs, with a real asset on your books and an inflation hedge baked in. The 40% accelerated depreciation creates an immediate tax shield in year 1.',
  },
  {
    q: 'What is the typical payback period for commercial solar?',
    a: 'CAPEX projects pay back in 3–5 years after accounting for accelerated depreciation and GST input credit. OPEX projects have no "payback" since there\'s no upfront spend — savings start day 1. Specific numbers depend on your tariff slab and load profile.',
  },
  {
    q: 'How does accelerated depreciation work for solar?',
    a: 'Under Section 32 of the Income Tax Act, commercial solar assets qualify for 40% depreciation in year 1 (vs the normal 15%). At a 25% corporate tax rate, that\'s an immediate tax shield of ~10% of the system cost — a major reason CAPEX outperforms OPEX for profitable companies.',
  },
  {
    q: 'CAPEX, OPEX or hybrid — which should we choose?',
    a: 'Profitable companies with capital and tax appetite generally win with CAPEX — highest IRR, full ownership. Cash-tight companies or those expecting losses should consider OPEX. Hybrid (lease-to-own) works for mid-size businesses unsure of their 10-year horizon. We model all three on every quote.',
  },
  {
    q: 'How long does a typical commercial project take?',
    a: 'For systems up to 500 kW, expect 8–12 weeks from contract to commissioning. Larger projects (1 MW+) typically run 12–20 weeks. The critical path is usually DISCOM approvals (CEIG inspection, net metering / open-access), not the physical install.',
  },
  {
    q: 'What about industrial roofs that are metal sheet or aged?',
    a: 'We do a structural inspection in Phase 01. If the roof is metal sheet but sound, we use bracket-clamp mounts. If it\'s aged or asbestos, we typically include roof replacement in scope (often funded by the solar savings themselves). RCC roofs are easiest and cheapest to install on.',
  },
  {
    q: 'Will solar affect our operations during installation?',
    a: 'No. We work in zones, isolate sections, and schedule grid cutovers for low-load hours. For factories with continuous operations, we typically complete EPC over weekends and shutdowns. Production downtime is usually zero.',
  },
  {
    q: 'How do you guarantee performance over 25 years?',
    a: 'Three ways. (1) Tier-1 panels with 25-year linear warranty (≥85% output at year 25). (2) Inverter warranty 5–10 yrs with optional extension. (3) Our O&M contract includes a guaranteed Performance Ratio clause — if generation drops below the contractually agreed level, we pay the shortfall.',
  },
  {
    q: 'Can we also use solar to meet our Renewable Purchase Obligation?',
    a: 'Yes. Captive solar generation counts toward your RPO target in most states. We help with the registration with the SLDC and the issuance of RECs (Renewable Energy Certificates) where applicable.',
  },
]

// ─── Sections ──────────────────────────────────────────────────────────────

function CommercialHero() {
  return (
    <section
      style={{
        minHeight: '92svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(120px, 14vh, 180px)',
        paddingBottom: 'clamp(60px, 8vw, 120px)',
        background: 'var(--ink)',
        color: 'var(--bg)',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 720, height: 720,
          top: '-10%', right: '-15%',
          borderRadius: '50%',
          background: 'var(--ochre)',
          filter: 'blur(110px)',
          opacity: 0.22,
          animation: 'blob-drift-a 22s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', width: 580, height: 580,
          bottom: '-15%', left: '-10%',
          borderRadius: '50%',
          background: 'var(--moss)',
          filter: 'blur(90px)',
          opacity: 0.16,
          animation: 'blob-drift-b 28s ease-in-out infinite alternate',
        }} />
      </div>

      <div className="container-site" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'end' }}
          className="max-md:grid-cols-1">
          <div style={{ animation: 'fade-in 0.8s ease both' }}>
            <Eyebrow style={{ color: 'var(--ochre)' }}>Commercial & Industrial · 100 kW – 5 MW</Eyebrow>
            <h1 className="h-display" style={{ color: 'var(--bg)', marginTop: 20, marginBottom: 24 }}>
              Industrial-grade<br />
              <em style={{ color: 'var(--ochre)' }}>solar EPC.</em>
            </h1>
            <p className="lede" style={{ maxWidth: 540, marginBottom: 36, color: 'color-mix(in oklch, var(--bg) 72%, transparent)' }}>
              For factories, warehouses, hotels and campuses across India. End-to-end EPC, CAPEX or
              OPEX financing, and a guaranteed Performance Ratio for 25 years.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/#contact" className="btn btn-primary btn-arrow" style={{ background: 'var(--ochre)', color: 'var(--ink)' }}>
                Get a feasibility study
              </a>
              <a href="#models" className="btn btn-ghost" style={{ borderColor: 'var(--bg)', color: 'var(--bg)' }}>
                Compare financing
              </a>
            </div>
          </div>

          <div style={{ animation: 'fade-in 0.8s ease both', animationDelay: '0.2s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'color-mix(in oklch, var(--bg) 14%, transparent)', borderRadius: 16, overflow: 'hidden', border: '1px solid color-mix(in oklch, var(--bg) 14%, transparent)' }}>
              {[
                { v: 1000, s: '+ kW', l: 'Commercial commissioned' },
                { v: 28, s: '%', l: 'Avg post-tax IRR' },
                { v: 3, s: '–5 yrs', l: 'Typical payback' },
                { v: 25, s: ' yrs', l: 'PR-guaranteed O&M' },
              ].map(({ v, s, l }) => (
                <div key={l} style={{ background: 'color-mix(in oklch, var(--ink) 88%, var(--ochre))', padding: 'clamp(20px, 2.5vw, 28px)' }}>
                  <div style={{ fontFamily: 'Newsreader', fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1, color: 'var(--bg)', marginBottom: 8 }}>
                    <Counter target={v} suffix={s} />
                  </div>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 55%, transparent)' }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ marginTop: 16, fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 45%, transparent)' }}>
              Trusted by manufacturers, hotels, and educational campuses
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Why commercial solar, now</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              The most-tax-efficient asset on your books.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Industrial tariffs across major Indian states rose ~5% in 2025 and continue rising in 2026.
              Solar locks in your effective rate at ₹3 / unit for 25 years — and the tax man helps you pay
              for it.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(20px, 2.5vw, 32px)' }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.n} delay={i * 50}>
              <article style={{
                padding: 'clamp(28px, 3vw, 36px)',
                background: 'var(--bg-warm)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
                height: '100%',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.16em', color: 'var(--ochre-deep)' }}>{b.n}</span>
                <h3 className="h-card" style={{ marginTop: 16, marginBottom: 12 }}>{b.title}</h3>
                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.65, fontSize: 14 }}>{b.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Sectors() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Sectors we serve</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              From a 50 kW hotel rooftop to a 5 MW factory shed.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Every sector has a different load profile, tariff slab, and roof type. Our designs reflect that.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 2vw, 24px)' }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          {SECTORS.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <article style={{
                background: 'var(--bg)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ aspectRatio: '5/3' }}>
                  <ImgPh src={s.img} tag={s.typical} style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="h-card" style={{ marginBottom: 10, fontSize: 22 }}>{s.name}</h3>
                  <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{s.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinancingModels() {
  return (
    <section id="models" className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Financing models</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              CAPEX, OPEX, or somewhere in between.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Three structures, three different ways the cash and the tax benefits flow. Pick the one that
              fits your balance sheet — we'll model the math on your numbers.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 2vw, 24px)' }} className="max-md:grid-cols-1">
          {MODELS.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <article style={{
                padding: 'clamp(28px, 3vw, 36px)',
                background: m.name === 'CAPEX' ? 'var(--ink)' : 'var(--bg-warm)',
                color: m.name === 'CAPEX' ? 'var(--bg)' : 'var(--ink)',
                border: m.name === 'CAPEX' ? '1px solid var(--ink)' : '1px solid var(--rule)',
                borderRadius: 16,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                  <h3 className="h-card" style={{ color: 'inherit' }}>{m.name}</h3>
                  <span style={{
                    fontFamily: 'IBM Plex Mono',
                    fontSize: 9,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: m.name === 'CAPEX' ? 'var(--ochre)' : 'color-mix(in oklch, var(--ochre) 20%, transparent)',
                    color: m.name === 'CAPEX' ? 'var(--ink)' : 'var(--ochre-deep)',
                  }}>
                    {m.tag}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'Newsreader',
                  fontSize: 18,
                  lineHeight: 1.4,
                  color: m.name === 'CAPEX' ? 'var(--ochre)' : 'var(--ink)',
                  marginBottom: 16,
                  fontStyle: 'italic',
                }}>{m.headline}</p>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 75%, transparent)' : 'var(--ink-soft)',
                  marginBottom: 24,
                }}>{m.body}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 'auto' }}>
                  <div>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: m.name === 'CAPEX' ? 'var(--ochre)' : 'var(--moss-deep)', marginBottom: 10 }}>Pros</p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {m.pros.map(p => (
                        <li key={p} style={{ fontSize: 13, color: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 80%, transparent)' : 'var(--ink-soft)', paddingLeft: 14, position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, top: 7, width: 6, height: 1.5, background: m.name === 'CAPEX' ? 'var(--ochre)' : 'var(--moss-deep)' }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 55%, transparent)' : 'var(--clay)', marginBottom: 10 }}>Watch-outs</p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {m.cons.map(c => (
                        <li key={c} style={{ fontSize: 13, color: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 60%, transparent)' : 'var(--ink-mute)', paddingLeft: 14, position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, top: 7, width: 6, height: 1.5, background: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 40%, transparent)' : 'var(--clay)' }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: m.name === 'CAPEX' ? '1px solid color-mix(in oklch, var(--bg) 18%, transparent)' : '1px solid var(--rule)',
                }}>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 55%, transparent)' : 'var(--ink-mute)', marginBottom: 6 }}>Best for</p>
                  <p style={{ fontSize: 13, color: m.name === 'CAPEX' ? 'color-mix(in oklch, var(--bg) 85%, transparent)' : 'var(--ink)' }}>{m.bestFor}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSteps() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Project lifecycle</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Six phases. Zero surprises.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Every commercial project follows the same disciplined gate-by-gate process. You sign off at
              the end of each phase before we move to the next.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(20px, 2.5vw, 32px)' }} className="max-md:grid-cols-1">
          {VISIBLE_PHASES.map((p, i) => (
            <Reveal key={p.n} delay={i * 50}>
              <article style={{
                padding: 'clamp(24px, 2.5vw, 32px)',
                background: 'var(--bg)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ochre-deep)' }}>{p.n}</span>
                    <h3 className="h-card" style={{ marginTop: 6 }}>{p.title}</h3>
                  </div>
                  <span className="tag-pill">{p.duration}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.points.map(pt => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                      <span style={{ marginTop: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre)', flexShrink: 0 }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStudy() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>Case study · Manufacturing</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              A 450 kW rooftop, paid back in 3.6 years.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Mid-size auto-component manufacturer in a north-India industrial cluster. The numbers below
              come from their actual FY25–26 audited financials and are representative of large-rooftop
              C&I installations we deliver across India.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'stretch' }} className="max-md:grid-cols-1">
          <Reveal>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: '100%', minHeight: 420 }}>
              <ImgPh
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&q=80&auto=format&fit=crop"
                tag="C&I rooftop · 450 kW"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                background: 'var(--rule)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
                overflow: 'hidden',
              }}>
                {[
                  { v: '450 kW', l: 'System size' },
                  { v: '6,75,000', l: 'Units / year' },
                  { v: '₹2.7 Cr*', l: 'Total investment' },
                  { v: '₹76 L*', l: 'Annual savings' },
                  { v: '3.6 yrs*', l: 'Post-tax payback' },
                  { v: '24.8%*', l: 'Equity IRR' },
                ].map(s => (
                  <div key={s.l} style={{ background: 'var(--bg)', padding: 'clamp(18px, 2vw, 24px)' }}>
                    <div style={{ fontFamily: 'Newsreader', fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1, marginBottom: 8 }}>{s.v}</div>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', letterSpacing: '0.04em', color: 'var(--ink-mute)', lineHeight: 1.55 }}>
                * Indicative figures from one site. Final commercial returns depend on tariff slab,
                load profile, financing choice and applicable tax position.
              </p>

              <article style={{
                flex: 1,
                padding: 28,
                background: 'var(--bg-warm)',
                border: '1px solid var(--rule)',
                borderRadius: 14,
              }}>
                <p style={{ fontFamily: 'Newsreader', fontSize: 20, lineHeight: 1.45, color: 'var(--ink)', fontStyle: 'italic', marginBottom: 20 }}>
                  "Garv's design team caught a shading issue in Phase 01 that two earlier vendors missed.
                  Their model said 6.75 lakh units/year — we're tracking at 6.81. Three years of clean
                  numbers and no excuses."
                </p>
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                  <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>VP Operations</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 4 }}>
                    Auto-components manufacturer · India
                  </p>
                </div>
              </article>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CommercialFaqs() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>For finance and operations leaders</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              The questions your CFO will ask.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              For a broader list across home, commercial and technical topics, head to our{' '}
              <a href="/faqs" style={{ color: 'var(--ochre-deep)', textDecoration: 'underline', textUnderlineOffset: 3 }}>FAQs page</a>.
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
                  <div className={`faq-answer${isOpen ? ' open' : ''}`} style={isOpen ? { maxHeight: 320 } : undefined}>
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

function FinalCTA() {
  return (
    <section className="section-pad" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center' }} className="max-md:grid-cols-1">
          <Reveal>
            <SunMark size={48} />
            <h2 className="h-section" style={{ color: 'var(--bg)', marginTop: 24, marginBottom: 20 }}>
              Send us your last 3 bills.<br />
              <em style={{ color: 'var(--ochre)' }}>We'll send you a feasibility study.</em>
            </h2>
            <p style={{ color: 'color-mix(in oklch, var(--bg) 72%, transparent)', maxWidth: 560, lineHeight: 1.6, marginBottom: 32 }}>
              No-cost, no-obligation. Within five working days you'll have a site-specific generation model,
              CAPEX / OPEX / hybrid comparison, post-tax IRR, and a written savings projection — the
              numbers your finance team needs to greenlight the project.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/#contact" className="btn btn-primary btn-arrow" style={{ background: 'var(--ochre)', color: 'var(--ink)' }}>
                Request feasibility study
              </a>
              <a href="mailto:garvurjasolutions@gmail.com" className="btn btn-ghost" style={{ borderColor: 'var(--bg)', color: 'var(--bg)' }}>
                Email the team
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{
              padding: 'clamp(24px, 3vw, 36px)',
              background: 'color-mix(in oklch, var(--bg) 8%, transparent)',
              border: '1px solid color-mix(in oklch, var(--bg) 14%, transparent)',
              borderRadius: 16,
            }}>
              <Eyebrow style={{ color: 'var(--ochre)' }}>What you'll receive</Eyebrow>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Site-specific generation forecast',
                  'CAPEX / OPEX / hybrid comparison',
                  'Year-by-year savings & IRR model',
                  'Subsidy and tax-benefit mapping',
                  'Roof structural assessment',
                  'Indicative timeline & milestones',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'color-mix(in oklch, var(--bg) 85%, transparent)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CommercialSolarPage() {
  return (
    <>
      <Nav />
      <main>
        <CommercialHero />
        <Benefits />
        <Sectors />
        <FinancingModels />
        <ProcessSteps />
        <CaseStudy />
        <CommercialFaqs />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
