import { Eyebrow, Reveal } from '../../_shared'
import styles from './process.module.css'

const PROCESS_STEPS = [
  { num: '01', title: 'Site Survey', body: 'Our engineers visit your site to assess shadow patterns, roof strength, orientation and grid-connection point.' },
  { num: '02', title: 'System Design', body: 'We produce a detailed engineering design — module layout, single-line diagrams, energy simulations and financial projections.' },
  { num: '03', title: 'Approvals & DPR', body: 'We prepare the DPR, apply for net-metering approvals and coordinate DISCOM permissions on your behalf.' },
  { num: '04', title: 'Procurement', body: 'Tier-1 modules, Tier-1 inverters, galvanised structures and BIS-certified cables — sourced and inspected at our warehouse.' },
  { num: '05', title: 'Installation', body: 'Our certified electricians and civil crews complete the install in 3–10 working days depending on system size.' },
  { num: '06', title: 'Commissioning & O&M', body: 'We commission the plant with DISCOM, hand over monitoring access, and optionally continue with a long-term AMC.' },
]

export default function Process() {
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
        <div className={styles['process-grid']}>
          {PROCESS_STEPS.map(({ num, title, body }, i) => (
            <Reveal key={num} delay={i * 60}>
              <div className={styles['process-tile']}>
                <span className={styles['process-tile__num']}>{num}</span>
                <h3 className={styles['process-tile__title']}>{title}</h3>
                <p className={styles['process-tile__body']}>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
