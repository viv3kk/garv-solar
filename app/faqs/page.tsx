'use client'

import { useState, useMemo } from 'react'
import { Eyebrow, Plus, SunMark, Reveal, Nav, Footer } from '../_shared'

// ─── FAQ data, grouped by category ─────────────────────────────────────────

type FAQ = { q: string; a: React.ReactNode }
type Category = { id: string; label: string; description: string; faqs: FAQ[] }

const CATEGORIES: Category[] = [
  {
    id: 'basics',
    label: 'Solar Basics',
    description: 'What rooftop solar is, how it works, and whether it makes sense for you.',
    faqs: [
      {
        q: 'What is a rooftop solar system?',
        a: (
          <>
            A rooftop solar system converts sunlight into usable electricity for your home or business.
            The main components are solar panels (with PV cells), an inverter (DC → AC), a mounting structure,
            AC/DC cables, combiner boxes, earthing, and MC4 connectors. When sunlight hits the panels, the
            photovoltaic effect generates DC current, which the inverter converts into AC for everyday use.
          </>
        ),
      },
      {
        q: 'What are the different types of solar systems?',
        a: (
          <>
            There are three main types — <strong>On-grid</strong> systems are tied to the public electricity
            grid; excess power is exported and you earn credits under net metering. <strong>Off-grid</strong>{' '}
            systems use battery storage and aren't connected to the grid — best for remote sites without a
            reliable supply. <strong>Hybrid</strong> systems combine solar, battery, and the grid — daytime
            generation, evening battery backup, and grid as final fallback.
          </>
        ),
      },
      {
        q: 'Why should I switch to solar?',
        a: (
          <>
            If you're dealing with high electricity bills, solar is the most effective way to bring them down
            permanently. Beyond savings, solar reduces your dependence on the grid (and DISCOM tariff hikes),
            increases your property value, and meaningfully cuts your carbon footprint — a single 1 kW system
            avoids roughly one tonne of CO₂ every year for the next 25 years.
          </>
        ),
      },
      {
        q: 'Is solar power safe?',
        a: (
          <>
            Yes. The electricity produced by a solar system is identical to the power you get from your DISCOM —
            only the source is different. It's one of the safest forms of generation, with no fuel, no
            combustion, and no toxic emissions. Properly installed systems include earthing, surge protection,
            and automatic shutdown during a grid outage to protect line workers.
          </>
        ),
      },
      {
        q: 'Do solar panels work during monsoon and winter?',
        a: (
          <>
            Yes — panels still produce electricity on cloudy or rainy days, just at reduced efficiency
            (typically 10–25% of peak). Annual generation estimates already account for these losses, so your
            payback math doesn't change. Winter often produces more per panel than peak summer because cooler
            temperatures actually improve PV efficiency.
          </>
        ),
      },
      {
        q: 'Does my system generate power during a blackout?',
        a: (
          <>
            A standard on-grid system shuts off during a blackout for safety — to protect the engineers
            repairing the grid. If you want backup during outages, you'll need a hybrid system with a battery,
            which we can design for you.
          </>
        ),
      },
    ],
  },
  {
    id: 'cost',
    label: 'Cost & Savings',
    description: 'Pricing, payback, and how much you can realistically save.',
    faqs: [
      {
        q: 'How much does a rooftop solar system cost?',
        a: (
          <>
            For residential projects across India, expect roughly <strong>₹55,000–₹70,000 per kW</strong>{' '}
            before subsidy, depending on panel/inverter brand and mounting complexity. A typical 3 kW
            household system lands around ₹1.8–2.1 lakh before the ₹78,000 central subsidy, bringing your
            net cost to roughly ₹1.0–1.3 lakh. Commercial pricing is lower per kW at scale.
          </>
        ),
      },
      {
        q: 'How much can I actually save?',
        a: (
          <>
            Most of our home customers cut their electricity bills by <strong>80–95%</strong> from day one.
            A ₹3,000/month bill typically falls below ₹500. And because grid tariffs across Indian states
            have historically risen 3–5% annually, your effective savings compound every year.
          </>
        ),
      },
      {
        q: 'What is the payback period?',
        a: (
          <>
            Most residential systems pay back in <strong>3–5 years</strong>; commercial systems with
            accelerated depreciation typically pay back in <strong>2–4 years</strong>. After that, you enjoy
            20+ years of nearly free electricity from a 25-year asset.
          </>
        ),
      },
      {
        q: 'How high does my electricity bill need to be for solar to make sense?',
        a: (
          <>
            We've found solar works out economically for homes with bills starting around{' '}
            <strong>₹1,500/month</strong>. Below that, the system size is too small to outpace fixed
            interconnection charges. Commercial users benefit at almost any scale because of accelerated
            depreciation and high industrial tariffs.
          </>
        ),
      },
      {
        q: 'Are there hidden costs I should know about?',
        a: (
          <>
            With Garv, no — our quote is end-to-end: panels, inverter, mounting, cabling, earthing, net
            metering paperwork, DISCOM coordination, and commissioning. The only ongoing cost is panel
            cleaning (which you can do yourself with water and a soft cloth) and an optional AMC after the
            free warranty period.
          </>
        ),
      },
      {
        q: 'Will rising electricity prices affect my savings?',
        a: (
          <>
            They'll only make solar more valuable. Every tariff hike from your DISCOM increases the gap
            between what you'd have paid and what you actually pay — so your real savings grow each year
            until the system is paid off, and then accelerate further.
          </>
        ),
      },
    ],
  },
  {
    id: 'subsidy',
    label: 'Subsidy & Financing',
    description: 'PM Surya Ghar, EMI options, and how the money flows.',
    faqs: [
      {
        q: 'How does the PM Surya Ghar subsidy work in 2026?',
        a: (
          <>
            Under PM Surya Ghar Muft Bijli Yojana, the central government provides up to{' '}
            <strong>₹78,000</strong> for residential rooftop solar — ₹30,000 for the first kW, ₹60,000 for
            2 kW, and ₹78,000 for systems of 3 kW or more. Residents across all Indian states qualify for
            the central subsidy directly through the national portal — many states layer an additional
            top-up on top of the central amount.
          </>
        ),
      },
      {
        q: 'How do I claim the subsidy?',
        a: (
          <>
            We handle the entire process for you — registration on the National Portal, DISCOM application,
            inspection coordination, and post-installation subsidy disbursement (typically within 30 days of
            commissioning). The subsidy is credited directly to your bank account. You don't fill a single
            government form.
          </>
        ),
      },
      {
        q: 'Are there subsidies for commercial solar?',
        a: (
          <>
            No central subsidy applies to commercial or industrial installations. However, commercial
            customers can claim <strong>40% accelerated depreciation</strong> in year 1 under Section 32 of
            the Income Tax Act, plus GST input tax credit on the system cost — usually a bigger financial
            benefit than the residential subsidy.
          </>
        ),
      },
      {
        q: 'Do I have to pay the full amount upfront?',
        a: (
          <>
            No. We partner with banks and NBFCs for collateral-free solar loans with{' '}
            <strong>0% EMI options for 6 months</strong> and longer-term tenors up to 5 years. In many cases,
            your monthly savings cover the EMI from month one — meaning you go solar with effectively zero
            net cash outflow.
          </>
        ),
      },
      {
        q: 'What financing models exist for businesses?',
        a: (
          <>
            Three main options. <strong>CAPEX</strong> — you own the system, claim depreciation and ITC,
            and keep all the savings. <strong>OPEX / PPA / RESCO</strong> — a developer owns the system on
            your roof and you simply buy electricity from them at a fixed rate (typically ₹4–6/unit vs the
            grid's ₹9–14/unit) for 15–25 years, with zero capex. <strong>Hybrid leasing</strong> — split
            ownership with a structured buyout at year 5–7. We help you model all three.
          </>
        ),
      },
    ],
  },
  {
    id: 'install',
    label: 'Installation & Site',
    description: 'What we check, how long it takes, and what your roof can handle.',
    faqs: [
      {
        q: 'How long does installation take?',
        a: (
          <>
            Once your 3D design is approved, the physical installation is typically completed in{' '}
            <strong>1–2 days</strong> for a residential system, and 1–4 weeks for larger commercial sites.
            DISCOM net-meter installation and commissioning add 2–4 weeks on top, depending on local
            inspection availability.
          </>
        ),
      },
      {
        q: 'What do I need to qualify for solar?',
        a: (
          <>
            Just a shadow-free roof area and rooftop access. For a 1 kW system, you'll need approximately
            <strong> 80–100 sq ft</strong> of usable area. We handle everything else — site survey, design,
            structural check, paperwork, installation, and approvals.
          </>
        ),
      },
      {
        q: "I'm not sure if I have enough space.",
        a: (
          <>
            Don't guess — book a free site visit. Our engineer uses drone or laser-based shadow analysis to
            map every metre of usable area, factors in winter sun angles, and gives you a personalised 3D
            design showing exactly how the system will sit on your roof.
          </>
        ),
      },
      {
        q: 'My roof is metal sheet / tin / asbestos — can I still install solar?',
        a: (
          <>
            Yes. We've installed on RCC, metal sheet, Mangalore-tile, and even asbestos roofs. For asbestos
            or compromised roofs, we typically recommend replacing with GI sheets as part of the project —
            you get a safer roof and a stronger mounting base. We use non-penetrating ballasted mounts
            wherever feasible to preserve waterproofing.
          </>
        ),
      },
      {
        q: 'Will the installation damage my roof?',
        a: (
          <>
            No. We use chemically anchored mounts on RCC and bracket-clamp mounts on metal, both with
            engineered waterproofing at every penetration point. Our structures are designed for wind speeds
            up to 170 kmph (relevant for India's high-wind coastal, desert and plateau zones) and come
            with a written warranty.
          </>
        ),
      },
      {
        q: "What about India's dust storms, monsoons and high temperatures?",
        a: (
          <>
            Our designs are built for it. We use Tier-1 panels with anti-soiling coating, high-temp-rated
            inverters (50°C+ ambient), galvanised mounting structures rated for cyclone-zone winds, and a
            15° tilt to encourage dust self-cleaning during the monsoon. Generation estimates are de-rated
            for your local summer and rainy-season profile so your savings projections stay realistic
            whether you're in Chennai, Jaipur or Guwahati.
          </>
        ),
      },
    ],
  },
  {
    id: 'panels',
    label: 'Panels & Equipment',
    description: 'What goes on your roof — and how to tell the good from the cheap.',
    faqs: [
      {
        q: 'What kind of panels do you use?',
        a: (
          <>
            Tier-1 monocrystalline PERC and TOPCon modules from MNRE-approved manufacturers (Waaree, Vikram,
            Adani, Premier, Jinko). For residential we typically install 540–580 W modules; for commercial,
            580–620 W bifacial modules where rooftop conditions allow. Every panel is BIS-certified and ALMM
            -listed.
          </>
        ),
      },
      {
        q: 'String inverter or microinverter — what should I choose?',
        a: (
          <>
            A <strong>string inverter</strong> is cost-effective and the right choice for most rooftops with
            unobstructed sun. <strong>Microinverters / power optimisers</strong> shine when your roof has
            partial shading, multiple orientations, or you want per-panel monitoring — they cost more but
            harvest 5–25% more annual energy in shaded conditions. We'll recommend based on your actual roof,
            not a sales target.
          </>
        ),
      },
      {
        q: 'What warranties come with the equipment?',
        a: (
          <>
            Standard: <strong>12-year product</strong> and <strong>25-year linear performance</strong>{' '}
            warranty on panels (≥85% output at year 25), <strong>5–10 year</strong> warranty on inverters,
            and a <strong>10-year</strong> warranty on mounting structures. We also offer an extended AMC
            covering everything for years 6–10.
          </>
        ),
      },
      {
        q: "How do I know I'm getting genuine Tier-1 equipment?",
        a: (
          <>
            We share <strong>serial numbers, IEC certificates, and ALMM listing</strong> for every panel and
            inverter delivered to your site, plus a stamped material check at unboxing. You can verify each
            panel directly with the manufacturer using its serial number — we encourage it.
          </>
        ),
      },
      {
        q: 'What is the lifespan of a rooftop solar system?',
        a: (
          <>
            <strong>25 years or more</strong> for the panels themselves. Inverters typically last 10–15
            years and may need one replacement at the midpoint. Mounting structures are designed to outlast
            the panels. With professional maintenance, expect 20+ years of steady, high savings.
          </>
        ),
      },
    ],
  },
  {
    id: 'netmeter',
    label: 'Net Metering & DISCOM',
    description: 'How exported units get credited, and what to expect from your DISCOM.',
    faqs: [
      {
        q: 'What is net metering?',
        a: (
          <>
            Net metering is the billing arrangement that lets you export surplus solar power to the grid and
            receive credit on your bill. A bidirectional meter records both imported (from grid) and
            exported (to grid) units. At month-end you're billed only on the <em>net</em> consumption — if
            you exported more than you imported, units are carried forward to the next month.
          </>
        ),
      },
      {
        q: 'How is net metering different from net billing or gross metering?',
        a: (
          <>
            <strong>Net metering</strong> credits exported units at the retail tariff (best for consumers).{' '}
            <strong>Net billing</strong> credits at a lower wholesale rate. <strong>Gross metering</strong>{' '}
            sells all your solar power to the DISCOM at a fixed feed-in tariff while you continue buying at
            retail. Most Indian states currently allow net metering for residential systems up to 500 kW;
            policy limits vary by state.
          </>
        ),
      },
      {
        q: 'How long does net meter installation take?',
        a: (
          <>
            After your solar installation is complete, we file the application with your local DISCOM
            (JVVNL, BSES, MSEDCL, TANGEDCO, BESCOM, TSSPDCL — whichever serves your address). The DISCOM
            inspects the system, replaces your existing meter with a bidirectional one, and issues
            commissioning approval. Typically <strong>2–4 weeks</strong> across most Indian DISCOMs; we
            manage every follow-up.
          </>
        ),
      },
      {
        q: 'What if I generate more than I consume?',
        a: (
          <>
            Excess units roll over month to month for the financial year. At year-end (March 31), most
            DISCOMs settle unused credits at the average pooled cost of power (typically ₹2–3/unit) — much
            less than the retail rate, so the goal is to size your system to <em>match</em> annual
            consumption, not vastly exceed it. We'll model this for you during design.
          </>
        ),
      },
    ],
  },
  {
    id: 'maintenance',
    label: 'Maintenance & Monitoring',
    description: 'Keeping your system at peak performance — for 25 years.',
    faqs: [
      {
        q: 'How often do I need to clean the panels?',
        a: (
          <>
            In most Indian climates we recommend cleaning <strong>twice a month</strong> in summer and
            after dust storms or pollution events. Cities like Delhi, Lucknow and Kanpur may need
            additional cleaning during high-AQI weeks. Use a soft nylon brush or sponge with plain water —
            never metal brushes,
            detergents, or pressure washers (they can damage the anti-reflective coating). Clean early
            morning or evening when panels are cool.
          </>
        ),
      },
      {
        q: "What's covered in your AMC / maintenance package?",
        a: (
          <>
            We offer a <strong>free 5-year AMC*</strong> on every system we install. It includes quarterly
            panel cleaning, monthly remote performance audits, all preventive maintenance, IV-curve testing,
            connection torque-checks, and component replacement under warranty. Extended AMC options cover
            years 6–25. <em style={{ fontStyle: 'normal', color: 'var(--ink-mute)', fontSize: '0.92em' }}>
              (*Conditions apply — full AMC terms shared with your quote.)
            </em>
          </>
        ),
      },
      {
        q: 'How do I monitor my system?',
        a: (
          <>
            Every system ships with a Wi-Fi-enabled inverter and our mobile app (iOS + Android). You see
            real-time generation, daily/monthly/yearly totals, savings in ₹, CO₂ avoided, and any fault
            alerts. We monitor the same data on our end and proactively dispatch a technician if anything
            looks off — usually before you even notice.
          </>
        ),
      },
      {
        q: 'Do panels degrade over time?',
        a: (
          <>
            Yes — but slowly. Tier-1 panels degrade at roughly <strong>0.4–0.5% per year</strong>, meaning
            you're still at ≥85% of rated output at year 25 (covered by the linear performance warranty).
            Compare with cheap panels that lose 1%+ per year and underperform within a decade.
          </>
        ),
      },
      {
        q: 'What happens if a panel or inverter fails?',
        a: (
          <>
            File a single complaint via the app or call us — we coordinate the manufacturer's warranty
            claim, source the replacement, and install it free of charge during the warranty period (and at
            cost-plus afterwards). Our average on-site response time is under 48 hours in metros and
            72 hours nationwide.
          </>
        ),
      },
    ],
  },
  {
    id: 'about',
    label: 'About Garv Urja',
    description: 'Why choose us, and what makes Garv different.',
    faqs: [
      {
        q: 'What makes Garv Urja different?',
        a: (
          <>
            We're an owner-led EPC, not a faceless reseller. Our engineers understand the wind, dust and
            DISCOM processes of every region we install in; our crews show up when promised; and you deal
            with the same project manager from quote to year-25 service. We're MNRE-registered, work
            across India, and put a written savings projection on every quote.
          </>
        ),
      },
      {
        q: 'Are you MNRE-registered?',
        a: (
          <>
            Yes. Garv Urja Solutions is registered with the Ministry of New and Renewable Energy and is a
            DISCOM-empanelled vendor for residential rooftop solar across multiple Indian states. We're
            authorised to file net-metering and PM Surya Ghar applications on your behalf.
          </>
        ),
      },
      {
        q: 'Do you handle the entire project end-to-end?',
        a: (
          <>
            Yes — survey, 3D design, structural check, financing assistance, subsidy paperwork, supply,
            installation, commissioning, net-metering, monitoring, and 5-year AMC*. You have one point of
            contact and one accountable team. No middlemen, no surprise charges. (*AMC subject to terms.)
          </>
        ),
      },
      {
        q: 'Which cities and regions do you serve?',
        a: (
          <>
            We're headquartered in Alwar, Rajasthan and serve homes and businesses{' '}
            <strong>across India</strong>. We have on-the-ground project teams covering most major Indian
            metros and tier-2 cities, and we travel nationwide for commercial projects above 100 kW.
            Share your pincode on the contact form and we'll confirm coverage for your specific location.
          </>
        ),
      },
      {
        q: 'How do I get started?',
        a: (
          <>
            Share your latest electricity bill and rooftop photos via WhatsApp (+91-8810405990) or our
            contact form. We'll send a preliminary savings estimate within 24 hours, followed by a free
            on-site visit and a personalised 3D design. No obligations.
          </>
        ),
      },
    ],
  },
]

// ─── Sections ───────────────────────────────────────────────────────────────

function FaqHero() {
  return (
    <section
      style={{
        minHeight: '60svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(120px, 14vh, 180px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        background: 'var(--bg-warm)',
      }}
    >
      {/* Atmospheric backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            width: 520, height: 520,
            top: '-10%', right: '-8%',
            borderRadius: '50%',
            background: 'var(--ochre)',
            filter: 'blur(90px)',
            opacity: 0.18,
            animation: 'blob-drift-a 24s ease-in-out infinite alternate',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 440, height: 440,
            bottom: '-20%', left: '-5%',
            borderRadius: '50%',
            background: 'var(--moss)',
            filter: 'blur(80px)',
            opacity: 0.14,
            animation: 'blob-drift-b 28s ease-in-out infinite alternate',
          }}
        />
      </div>

      <div className="container-site" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'end' }}
          className="max-md:grid-cols-1">
          <div>
            <Eyebrow>Knowledge · 2026 edition</Eyebrow>
            <h1 className="h-display" style={{ marginTop: 20, marginBottom: 24 }}>
              Every question.<br />
              <em style={{ color: 'var(--ochre)' }}>One honest answer.</em>
            </h1>
            <p className="lede" style={{ maxWidth: 520 }}>
              We've gathered the questions our customers — and the wider solar-curious — ask most often.
              Browse by category, search for what you need, and call us when you want to dig deeper.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '50+', l: 'Questions answered' },
              { n: '8', l: 'Categories covered' },
              { n: '< 24 hr', l: 'Response on contact' },
            ].map(({ n, l }) => (
              <div
                key={l}
                style={{
                  padding: '16px 20px',
                  background: 'var(--bg)',
                  border: '1px solid var(--rule)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: 'Newsreader', fontSize: 32, lineHeight: 1, color: 'var(--ink)' }}>
                  {n}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', textAlign: 'right' }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 70,
        zIndex: 50,
        background: 'color-mix(in oklch, var(--bg) 92%, transparent)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div className="container-site" style={{ paddingTop: 12, paddingBottom: 12 }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORIES.map(c => {
            const isActive = active === c.id
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                style={{
                  flexShrink: 0,
                  background: isActive ? 'var(--ink)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--ink-soft)',
                  border: isActive ? '1px solid var(--ink)' : '1px solid var(--rule)',
                  borderRadius: 999,
                  padding: '8px 16px',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                }}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FAQItem({ item, isOpen, onToggle }: { item: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
      >
        <span>{item.q}</span>
        <Plus open={isOpen} />
      </button>
      <div
        className={`faq-answer${isOpen ? ' open' : ''}`}
        style={isOpen ? { maxHeight: 600 } : undefined}
      >
        {item.a}
      </div>
    </div>
  )
}

function FaqList({
  query,
  active,
  setActive,
}: {
  query: string
  active: string
  setActive: (id: string) => void
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(
        f =>
          f.q.toLowerCase().includes(q) ||
          (typeof f.a === 'string' ? (f.a as string).toLowerCase().includes(q) : false),
      ),
    })).filter(cat => cat.faqs.length > 0)
  }, [query])

  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'clamp(32px, 4vw, 64px)' }} className="max-md:grid-cols-1">
          {/* Sidebar TOC */}
          <aside className="max-md:hidden" style={{ position: 'sticky', top: 140, alignSelf: 'start' }}>
            <Eyebrow>Categories</Eyebrow>
            <nav style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATEGORIES.map(c => {
                const isActive = active === c.id
                return (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    onClick={() => setActive(c.id)}
                    style={{
                      textDecoration: 'none',
                      padding: '10px 12px',
                      borderRadius: 6,
                      fontSize: 14,
                      color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                      background: isActive ? 'var(--bg-warm)' : 'transparent',
                      borderLeft: `2px solid ${isActive ? 'var(--ochre)' : 'transparent'}`,
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {c.label}
                    <span style={{ float: 'right', fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--ink-mute)' }}>
                      {c.faqs.length}
                    </span>
                  </a>
                )
              })}
            </nav>
          </aside>

          {/* Content */}
          <div>
            {filtered.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <SunMark size={48} />
                <h3 className="h-card" style={{ marginTop: 20, marginBottom: 8 }}>No matches.</h3>
                <p style={{ color: 'var(--ink-soft)' }}>
                  Couldn't find anything for "{query}". Drop us a line and we'll answer directly.
                </p>
              </div>
            )}

            {filtered.map((cat, ci) => (
              <Reveal key={cat.id} delay={ci * 40}>
                <div id={cat.id} style={{ marginBottom: 64, scrollMarginTop: 140 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                    <h2 className="h-section" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
                      {cat.label}
                    </h2>
                    <span className="tag-pill">{String(cat.faqs.length).padStart(2, '0')} questions</span>
                  </div>
                  <p style={{ color: 'var(--ink-soft)', maxWidth: 600, marginBottom: 24 }}>
                    {cat.description}
                  </p>
                  <div>
                    {cat.faqs.map((f, fi) => {
                      const key = `${cat.id}-${fi}`
                      return (
                        <FAQItem
                          key={key}
                          item={f}
                          isOpen={openKey === key}
                          onToggle={() => setOpenKey(openKey === key ? null : key)}
                        />
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StillStuck() {
  return (
    <section className="section-pad" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center' }}
          className="max-md:grid-cols-1">
          <Reveal>
            <Eyebrow style={{ color: 'var(--ochre)' }}>Still stuck?</Eyebrow>
            <h2 className="h-section" style={{ color: 'var(--bg)', marginTop: 16, marginBottom: 20 }}>
              Talk to a real person.
            </h2>
            <p style={{ color: 'color-mix(in oklch, var(--bg) 70%, transparent)', maxWidth: 520, lineHeight: 1.6, marginBottom: 28 }}>
              Some questions need a roof to look at. Send us photos and your latest bill; we'll come back with a
              preliminary savings number within 24 hours — no obligation, no pressure.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/#contact" className="btn btn-primary btn-arrow" style={{ background: 'var(--ochre)', color: 'var(--ink)' }}>
                Send your bill
              </a>
              <a href="tel:+918810405990" className="btn btn-ghost" style={{ borderColor: 'var(--bg)', color: 'var(--bg)' }}>
                +91 8810 4059 90
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
              <Eyebrow style={{ color: 'color-mix(in oklch, var(--bg) 50%, transparent)' }}>Topics we cover by phone</Eyebrow>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Bill analysis & system sizing',
                  'Subsidy eligibility check',
                  'Site feasibility from photos',
                  'CAPEX vs OPEX for businesses',
                  'Net metering & DISCOM coordination',
                  'AMC and post-installation support',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'color-mix(in oklch, var(--bg) 85%, transparent)' }}>
                    <span style={{ marginTop: 7, width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre)', flexShrink: 0 }} />
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function FAQsPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(CATEGORIES[0].id)

  return (
    <>
      <Nav />
      <main>
        <FaqHero />

        {/* Search bar */}
        <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--rule)' }}>
          <div className="container-site" style={{ padding: '24px 0' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px',
              background: 'var(--bg-warm)',
              border: '1px solid var(--rule)',
              borderRadius: 999,
              maxWidth: 720,
              margin: '0 auto',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden style={{ flexShrink: 0, color: 'var(--ink-mute)' }}>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search questions — subsidy, payback, net metering…"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontFamily: 'IBM Plex Sans',
                  fontSize: 15,
                  color: 'var(--ink)',
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', fontSize: 12, fontFamily: 'IBM Plex Mono', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <CategoryNav active={active} onSelect={(id) => {
          setActive(id)
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }} />

        <FaqList query={query} active={active} setActive={setActive} />

        <StillStuck />
      </main>
      <Footer />
    </>
  )
}
