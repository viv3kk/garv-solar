'use client'

import { useState } from 'react'
import { Eyebrow, Arrow, Plus, SunMark, ImgPh, Reveal, Counter, Nav, Footer } from './_shared'
import Calculator from './components/calculator'
import Hero from './components/hero'
import Process from './components/process'

// ─── Hero → app/components/hero/index.tsx ────────────────────────────────────

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
        {/* 2-col: left = heading + image, right = text + numbered pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'start' }} className="max-md:grid-cols-1">
          {/* Left column */}
          <Reveal>
            <Eyebrow>Our Story</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 16, marginBottom: 28 }}>
              Solar pioneers
            </h2>
            <ImgPh
              src="/images/sites/site-1.jpeg"
              alt="Garv Urja Solutions team installing a ground-mount solar array on site"
              tag="On-site, Alwar"
              style={{ aspectRatio: '4/3', borderRadius: 16 }}
            />
          </Reveal>

          {/* Right column */}
          <Reveal delay={100}>
            <p className="lede" style={{ marginBottom: 32 }}>
              At Garv Urja Solutions, we transform rooftops and open spaces into clean, reliable energy through end-to-end solar EPC solutions. From residential to commercial projects, our mission is to deliver sustainable, affordable, and future-ready solar power with a strong focus on quality, reliability, and environmental responsibility.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
              {[
                {
                  num: '01',
                  title: 'End-to-End EPC',
                  body: 'We handle everything — site survey, system design, civil, electrical, and commissioning — so you get a single point of accountability.',
                },
                {
                  num: '02',
                  title: 'MNRE Registered Vendor',
                  body: "Quality management isn't a checkbox for us; it's the backbone of every installation, from wiring harness to inverter selection.",
                },
                {
                  num: '03',
                  title: 'Long-term Partnership',
                  body: 'Our O&M contracts keep your system running at peak yield for 25 years, with remote monitoring and rapid-response field teams.',
                },
              ].map(({ num, title, body }) => (
                <div key={num} style={{ display: 'flex', gap: 20, paddingBottom: 24, borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em', paddingTop: 3, flexShrink: 0 }}>{num}</span>
                  <div>
                    <h3 style={{ fontFamily: 'Newsreader', fontSize: 20, marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn-ghost btn-arrow">Work With Us</a>
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
    imgTag: 'Residential install',
  },
  {
    id: 'ground',
    label: 'Ground-Mount',
    title: 'Ground-Mount & Utility Projects',
    body: 'For industries, municipalities and farmers looking to utilise open land, we deliver MW-scale ground-mounted plants with full DC/AC engineering and grid-synchronisation.',
    bullets: ['1 kW to multi-MW turnkey projects', 'Agri-solar (agrivoltaic) designs', 'Screw piles or concrete foundations', 'SCADA & remote monitoring'],
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80&auto=format&fit=crop',
    imgTag: 'Ground-mount utility array',
  },
  {
    id: 'epc',
    label: 'EPC Services',
    title: 'Full EPC for Commercial & Industrial',
    body: 'We act as the single contract EPC partner for C&I clients — handling procurement, civil, electrical, net-metering, and commissioning under one roof.',
    bullets: ['Single contract accountability', 'Detailed energy yield simulation', 'Net-metering & banking advisory', 'DPR preparation & bank funding support'],
    img: '/images/services-epc.png',
    imgTag: 'Industrial EPC, India',
  },
  {
    id: 'om',
    label: 'O&M',
    title: 'Operations & Maintenance',
    body: 'A solar plant is a 25-year asset. Our AMC and O&M contracts protect that asset with regular audits, cleaning schedules, inverter servicing and remote performance monitoring.',
    bullets: ['Annual & comprehensive AMC plans', 'Remote SCADA performance alerts', 'Panel cleaning & thermography', 'Rapid response within 24 hours'],
    img: 'https://images.unsplash.com/photo-1591105327764-d20bbf65a25c?w=900&q=80&auto=format&fit=crop',
    imgTag: 'O&M inspection',
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

// ─── Process → app/components/process/index.tsx ──────────────────────────────

// ─── Calculator ───────────────────────────────────────────────────────────────

// ─── Projects ─────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: 'Industrial Rooftop, Pune',
    size: '120 kWp',
    type: 'Rooftop EPC',
    year: '2024',
    img: '/images/project-industrial.png',
    tag: 'Pune, Maharashtra',
  },
  {
    title: 'Institutional Ground-Mount, Alwar',
    size: '25 kWp',
    type: 'Ground-Mount',
    year: '2026',
    img: '/images/sites/site-2.jpeg',
    tag: 'Arvind Reni, Alwar',
  },
  {
    title: 'Residential Solar Carport',
    size: '8 kWp',
    type: 'Elevated Rooftop',
    year: '2026',
    img: '/images/sites/site-3.jpeg',
    tag: 'Budhvihar, Alwar',
  },
  {
    title: 'Rooftop Elevated Mount',
    size: '5 kWp',
    type: 'Elevated Rooftop',
    year: '2026',
    img: '/images/sites/site-4.jpeg',
    tag: 'Aravali Vihar, Alwar',
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
              From elevated residential rooftops to institutional-scale ground-mount arrays —
              recent installations from across our portfolio.
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
  { value: 1000, suffix: '+', label: 'kW Commissioned', unit: 'kilowatts' },
  { value: 100, suffix: '+', label: 'Installations', unit: 'projects' },
  { value: 50000, suffix: '', label: 'Tonnes CO₂ Avoided', unit: 'lifetime est.' },
  { value: 10, suffix: 'Cr+', label: 'Client Savings', unit: '₹ cumulative' },
]

function Impact() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-deep)' }}>
      <div className="container-site">
        <Reveal>
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
    quote: "Garv Urja handled our rooftop from survey to net-metering approval seamlessly. Our electricity bill dropped significantly from day one.",
    author: 'Manish Khandelwal',
    role: 'Owner, Kapil Vaastu Villa',
    location: 'Alwar, Rajasthan',
    initials: 'MK',
  },
  {
    quote: "Excellent workmanship and even better after-sales support. Our system still produces above the guaranteed yield. Worth every rupee.",
    author: 'Manoj Chachan',
    role: 'Owner, Satyatej Mercantile Private Limited',
    location: 'New Shanti Kunj, Rajasthan',
    initials: 'MC',
  },
  {
    quote: "We installed a system at home and the team made the entire process completely painless. Highly recommend Garv Urja Solutions.",
    author: 'Devki Nandan Gupta',
    role: 'Homeowner',
    location: 'Ambedkar Nagar, Rajasthan',
    initials: 'DG',
  },
]

function Testimonials() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-warm)' }}>
      <div className="container-site">
        <Reveal style={{ marginBottom: 'clamp(40px, 5vw, 72px)', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>What Clients Say</Eyebrow>
          <h2 className="h-section" style={{ marginTop: 16 }}>
            Trusted across.
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
    bio: 'Solar entrepreneur and industry veteran with 15+ years in electrical engineering and pan-India project delivery.',
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
  { q: "Can solar panels withstand India's extreme summers, monsoons and dust storms?", a: "Yes — quality solar modules are tested to IEC 61215 and IEC 61730 standards, which include temperature cycling, humidity, UV, hail and wind load tests. Our mounting structures are designed for India's wind zones (including cyclone-prone coasts and desert belts) and we use anti-soiling coated glass on every panel to handle dusty conditions. We've had zero structural failures across our installed base nationwide." },
  { q: 'Is Garv Urja Solutions a government-approved channel partner?', a: 'Yes, we are an MNRE-registered EPC company serving customers across India. We are registered under PM Surya Ghar and can process subsidy applications directly through the national portal on behalf of our clients in every state.' },
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
                { label: 'Address', value: 'I-15, Ambedkar Nagar,\nAlwar, Rajasthan – 301001' },
                { label: 'Phone', value: '+91-8810405990' },
                { label: 'Email', value: 'garvurjasolutions@gmail.com' },
                { label: 'Registration', value: 'Registered Vendor' },
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
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'color-mix(in oklch, var(--bg) 40%, transparent)', letterSpacing: '0.12em' }}>Ambedkar Nagar, Alwar</span>
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
        {/* <Shop /> */}
        <Testimonials />
        {/* <Team /> */}
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
