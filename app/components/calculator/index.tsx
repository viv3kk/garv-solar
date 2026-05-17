'use client'

import { useState } from 'react'
import { Eyebrow, Arrow, Reveal } from '../../_shared'

export default function Calculator() {
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
              Enter your average monthly electricity consumption and we'll estimate the system size, savings and payback period.
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
                { label: 'Monthly Savings', value: `₹${monthlySavings.toLocaleString('en-IN')}*`, sub: `@ ₹${tariff}/unit` },
                { label: 'Yearly Savings', value: `₹${yearlySavings.toLocaleString('en-IN')}*`, sub: 'estimated savings' },
                { label: 'CO₂ Offset', value: `${co2} t/yr`, sub: 'tonnes per year' },
                { label: 'Approx. Cost', value: `₹${(cost / 100000).toFixed(1)}L*`, sub: 'before subsidy' },
                { label: 'Payback Period', value: `${payback} yrs*`, sub: 'return on investment' },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{ padding: 'clamp(16px, 2vw, 24px)', background: 'color-mix(in oklch, var(--bg) 5%, transparent)' }}>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--bg) 45%, transparent)', marginBottom: 8 }}>{label}</p>
                  <p style={{ fontFamily: 'Newsreader', fontSize: 'clamp(22px, 2.5vw, 30px)', color: 'var(--bg)', lineHeight: 1.1, marginBottom: 4 }}>{value}</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'color-mix(in oklch, var(--bg) 40%, transparent)' }}>{sub}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: 'color-mix(in oklch, var(--bg) 38%, transparent)', lineHeight: 1.5 }}>
              * Estimates based on average Indian solar irradiation (5.0–5.5 kWh/m²/day) and typical DISCOM tariff rates. Actual savings vary by state and consumption pattern.
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/calculator" className="btn" style={{ background: 'var(--ochre)', color: 'var(--bg)', borderColor: 'var(--ochre)' }}>
                Open detailed calculator <Arrow />
              </a>
              <a href="#contact" className="btn btn-ghost" style={{ borderColor: 'color-mix(in oklch, var(--bg) 25%, transparent)', color: 'var(--bg)' }}>
                Get a proposal
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
