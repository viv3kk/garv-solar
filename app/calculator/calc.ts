import {
  CAPEX_PER_KW,
  CO2_PER_KWH,
  DEGRADATION,
  GST,
  HORIZON_YRS,
  PPA_DISCOUNT,
  PR,
  SHADE_FACTOR,
  SQFT_PER_KW,
  STATES,
  SUBSIDY_CAP,
  SUBSIDY_SLABS,
  TARIFF_ESC,
  TIER_MOD,
  TREES_PER_T,
  type Financing,
  type Segment,
  type Shading,
} from './constants'

export interface CalcInput {
  segment: Segment
  stateCode: string
  monthlyUnits: number     // kWh/month
  roofSqft: number
  shading: Shading
  financing: Financing
  loanTenureYrs: number
  loanRate: number
}

export interface CalcResult {
  // Sizing
  kW: number
  roofLimitedKw: number
  roofLimited: boolean

  // Production
  yr1Kwh: number
  lifetimeKwh: number

  // Economics
  tariff: number
  grossCost: number
  subsidy: number
  netCost: number
  gstAmount: number
  monthlySavingsYr1: number
  yearlySavingsYr1: number
  lifetimeSavings: number
  paybackYrs: number

  // Financing
  emi: number | null
  ppaRate: number | null
  ppaMonthlySavings: number | null

  // Env
  co2Yr1: number          // tonnes/yr (year 1)
  co2Lifetime: number     // tonnes total
  treesEquivalent: number

  // Per-year projection
  projection: YearRow[]
}

export interface YearRow {
  year: number
  kwh: number
  savings: number
  cumulativeSavings: number
}

const round = (n: number, p = 0) => {
  const k = Math.pow(10, p)
  return Math.round(n * k) / k
}

export function pmSuryaGhar(kW: number): number {
  let subsidy = 0
  let remaining = kW
  for (const slab of SUBSIDY_SLABS) {
    const take = Math.min(remaining, 1)
    if (take <= 0) break
    subsidy += take * slab.amountPerKw
    remaining -= take
  }
  return Math.min(subsidy, SUBSIDY_CAP)
}

export function emiMonthly(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function calculate(input: CalcInput): CalcResult {
  const st = STATES[input.stateCode] ?? STATES.RJ
  const shadeMult = SHADE_FACTOR[input.shading]

  // 1) Sizing — kW required to cover the user's monthly consumption
  const dailyKwh = input.monthlyUnits / 30
  const kwReq    = dailyKwh / (st.gh * PR * shadeMult)
  const roofMaxKw = Math.max(1, input.roofSqft / SQFT_PER_KW)
  const sized    = Math.max(1, round(kwReq, 1))
  const kW       = Math.min(sized, roofMaxKw)
  const roofLimited = sized > roofMaxKw

  // 2) Production
  const annualGenBase = kW * st.gh * 365 * PR * shadeMult
  const yr1Kwh = annualGenBase

  // 3) Capex & subsidy
  const baseCost  = kW * CAPEX_PER_KW[input.segment] * TIER_MOD[st.tier]
  const gstAmount = baseCost * GST[input.segment]
  const grossCost = baseCost + gstAmount
  const subsidy   = input.segment === 'residential' ? pmSuryaGhar(kW) : 0
  const netCost   = Math.max(0, grossCost - subsidy)

  // 4) Tariff & savings projection
  const tariff = st.tariff
  const projection: YearRow[] = []
  let cumulative = 0
  let lifetimeKwh = 0
  let paybackYrs = 0
  for (let y = 1; y <= HORIZON_YRS; y++) {
    const kwh = annualGenBase * Math.pow(1 - DEGRADATION, y - 1)
    const yearTariff = tariff * Math.pow(1 + TARIFF_ESC, y - 1)
    const savings = kwh * yearTariff
    cumulative += savings
    lifetimeKwh += kwh
    if (paybackYrs === 0 && cumulative >= netCost) {
      // Interpolate within the year for a fractional payback
      const prevCum = cumulative - savings
      const frac = (netCost - prevCum) / savings
      paybackYrs = round(y - 1 + frac, 1)
    }
    projection.push({
      year: y,
      kwh: round(kwh),
      savings: round(savings),
      cumulativeSavings: round(cumulative),
    })
  }

  const yearlySavingsYr1  = projection[0].savings
  const monthlySavingsYr1 = yearlySavingsYr1 / 12

  // 5) Financing
  let emi: number | null = null
  if (input.financing === 'loan') {
    emi = emiMonthly(netCost, input.loanRate, input.loanTenureYrs)
  }
  let ppaRate: number | null = null
  let ppaMonthlySavings: number | null = null
  if (input.financing === 'opex' && input.segment !== 'residential') {
    ppaRate = tariff * (1 - PPA_DISCOUNT)
    ppaMonthlySavings = (yr1Kwh / 12) * (tariff - ppaRate)
  }

  // 6) Env
  const co2Yr1      = yr1Kwh * CO2_PER_KWH
  const co2Lifetime = lifetimeKwh * CO2_PER_KWH
  const trees       = co2Lifetime * TREES_PER_T

  return {
    kW: round(kW, 1),
    roofLimitedKw: round(roofMaxKw, 1),
    roofLimited,
    yr1Kwh: round(yr1Kwh),
    lifetimeKwh: round(lifetimeKwh),
    tariff,
    grossCost: round(grossCost),
    subsidy: round(subsidy),
    netCost: round(netCost),
    gstAmount: round(gstAmount),
    monthlySavingsYr1: round(monthlySavingsYr1),
    yearlySavingsYr1: round(yearlySavingsYr1),
    lifetimeSavings: round(cumulative),
    paybackYrs: paybackYrs || HORIZON_YRS,
    emi: emi !== null ? round(emi) : null,
    ppaRate: ppaRate !== null ? round(ppaRate, 2) : null,
    ppaMonthlySavings: ppaMonthlySavings !== null ? round(ppaMonthlySavings) : null,
    co2Yr1: round(co2Yr1, 1),
    co2Lifetime: round(co2Lifetime, 1),
    treesEquivalent: round(trees),
    projection,
  }
}

// Helpers for derived inputs
export const billToUnits = (billRupees: number, tariff: number) =>
  tariff > 0 ? Math.round(billRupees / tariff) : 0
export const unitsToBill = (units: number, tariff: number) =>
  Math.round(units * tariff)
