// Source notes:
//   gh (Global Horizontal Irradiance, kWh/m²/day): MNRE Solar Resource Atlas / NREL NSRDB regional averages
//   tariff (blended ₹/kWh per segment): CERC / state-DISCOM tariff orders for FY2024–25
//     residential = LT-I domestic, mid-slab (150–300 units/mo)
//     commercial  = LT-II non-domestic, mid-slab
//     industrial  = LT-V / HT industrial, effective rate incl. demand charges at ~70% load factor
//   tier: install logistics tier — 'a' metro, 'b' tier-2, 'c' remote (affects capex modifier)

export type Segment = 'residential' | 'commercial' | 'industrial'
export type Shading = 'none' | 'partial' | 'heavy'
export type Financing = 'cash' | 'loan' | 'opex'

export interface StateInfo {
  name: string
  gh: number
  tariff: Record<Segment, number>
  tier: 'a' | 'b' | 'c'
}

export const STATES: Record<string, StateInfo> = {
  RJ: { name: 'Rajasthan',        gh: 5.8, tariff: { residential: 7.5,  commercial: 9.5,  industrial: 7.8  }, tier: 'b' },
  GJ: { name: 'Gujarat',          gh: 5.7, tariff: { residential: 7.8,  commercial: 9.8,  industrial: 7.5  }, tier: 'a' },
  MH: { name: 'Maharashtra',      gh: 5.3, tariff: { residential: 11.5, commercial: 14.5, industrial: 10.5 }, tier: 'a' },
  KA: { name: 'Karnataka',        gh: 5.4, tariff: { residential: 8.6,  commercial: 10.8, industrial: 8.2  }, tier: 'a' },
  TN: { name: 'Tamil Nadu',       gh: 5.4, tariff: { residential: 6.8,  commercial: 9.1,  industrial: 7.3  }, tier: 'a' },
  DL: { name: 'Delhi',            gh: 5.2, tariff: { residential: 8.0,  commercial: 11.5, industrial: 9.5  }, tier: 'a' },
  UP: { name: 'Uttar Pradesh',    gh: 5.1, tariff: { residential: 7.2,  commercial: 9.3,  industrial: 7.8  }, tier: 'b' },
  MP: { name: 'Madhya Pradesh',   gh: 5.5, tariff: { residential: 7.6,  commercial: 9.2,  industrial: 7.5  }, tier: 'b' },
  HR: { name: 'Haryana',          gh: 5.3, tariff: { residential: 7.4,  commercial: 8.8,  industrial: 7.2  }, tier: 'b' },
  PB: { name: 'Punjab',           gh: 5.2, tariff: { residential: 7.0,  commercial: 8.5,  industrial: 6.5  }, tier: 'b' },
  TS: { name: 'Telangana',        gh: 5.4, tariff: { residential: 8.5,  commercial: 11.0, industrial: 8.0  }, tier: 'a' },
  AP: { name: 'Andhra Pradesh',   gh: 5.5, tariff: { residential: 8.0,  commercial: 10.5, industrial: 7.8  }, tier: 'b' },
  WB: { name: 'West Bengal',      gh: 4.8, tariff: { residential: 8.5,  commercial: 10.5, industrial: 8.2  }, tier: 'a' },
  KL: { name: 'Kerala',           gh: 4.6, tariff: { residential: 7.6,  commercial: 9.5,  industrial: 7.4  }, tier: 'b' },
  OR: { name: 'Odisha',           gh: 5.0, tariff: { residential: 5.8,  commercial: 7.5,  industrial: 6.2  }, tier: 'b' },
  BR: { name: 'Bihar',            gh: 4.9, tariff: { residential: 7.0,  commercial: 8.4,  industrial: 7.5  }, tier: 'b' },
  JH: { name: 'Jharkhand',        gh: 5.0, tariff: { residential: 6.8,  commercial: 8.5,  industrial: 6.8  }, tier: 'b' },
  CG: { name: 'Chhattisgarh',     gh: 5.3, tariff: { residential: 6.5,  commercial: 8.6,  industrial: 6.4  }, tier: 'b' },
  AS: { name: 'Assam',            gh: 4.5, tariff: { residential: 8.2,  commercial: 10.2, industrial: 8.0  }, tier: 'c' },
  UK: { name: 'Uttarakhand',      gh: 5.0, tariff: { residential: 6.5,  commercial: 8.2,  industrial: 6.0  }, tier: 'b' },
  HP: { name: 'Himachal Pradesh', gh: 4.9, tariff: { residential: 5.5,  commercial: 7.2,  industrial: 5.2  }, tier: 'c' },
  JK: { name: 'Jammu & Kashmir',  gh: 4.7, tariff: { residential: 5.8,  commercial: 7.5,  industrial: 6.0  }, tier: 'c' },
  GA: { name: 'Goa',              gh: 5.2, tariff: { residential: 4.5,  commercial: 6.5,  industrial: 4.8  }, tier: 'a' },
  CH: { name: 'Chandigarh',       gh: 5.2, tariff: { residential: 6.3,  commercial: 7.5,  industrial: 5.8  }, tier: 'a' },
  PY: { name: 'Puducherry',       gh: 5.3, tariff: { residential: 6.0,  commercial: 8.0,  industrial: 6.5  }, tier: 'b' },
  AN: { name: 'A&N Islands',      gh: 4.6, tariff: { residential: 5.5,  commercial: 8.5,  industrial: 7.5  }, tier: 'c' },
  LD: { name: 'Lakshadweep',      gh: 5.0, tariff: { residential: 5.5,  commercial: 8.0,  industrial: 7.0  }, tier: 'c' },
  MN: { name: 'Manipur',          gh: 4.5, tariff: { residential: 7.5,  commercial: 9.0,  industrial: 7.8  }, tier: 'c' },
  MZ: { name: 'Mizoram',          gh: 4.5, tariff: { residential: 8.0,  commercial: 9.5,  industrial: 8.2  }, tier: 'c' },
  NL: { name: 'Nagaland',         gh: 4.6, tariff: { residential: 7.8,  commercial: 9.2,  industrial: 8.0  }, tier: 'c' },
  TR: { name: 'Tripura',          gh: 4.6, tariff: { residential: 7.9,  commercial: 9.0,  industrial: 7.5  }, tier: 'c' },
  SK: { name: 'Sikkim',           gh: 4.7, tariff: { residential: 5.5,  commercial: 7.0,  industrial: 5.8  }, tier: 'c' },
  AR: { name: 'Arunachal Pradesh',gh: 4.5, tariff: { residential: 6.5,  commercial: 7.8,  industrial: 6.8  }, tier: 'c' },
  ML: { name: 'Meghalaya',        gh: 4.6, tariff: { residential: 6.8,  commercial: 8.5,  industrial: 7.0  }, tier: 'c' },
}

export const CAPEX_PER_KW: Record<Segment, number> = {
  residential: 55000,
  commercial:  48000,
  industrial:  42000,
}

export const TIER_MOD: Record<'a' | 'b' | 'c', number> = {
  a: 1.00,
  b: 1.03,
  c: 1.07,
}

export const GST: Record<Segment, number> = {
  residential: 0,
  commercial:  0.138,
  industrial:  0.138,
}

export const SHADE_FACTOR: Record<Shading, number> = {
  none:    1.00,
  partial: 0.92,
  heavy:   0.82,
}

export const PR            = 0.80    // Performance ratio (inverter + DC loss + soiling)
export const DEGRADATION   = 0.005   // 0.5%/yr panel output loss
export const TARIFF_ESC    = 0.03    // 3%/yr DISCOM tariff escalation
export const CO2_PER_KWH   = 0.00082 // tonnes CO₂ per kWh (CEA Indian grid factor)
export const TREES_PER_T   = 16.5    // mature-tree-year equivalents per tonne CO₂
export const HORIZON_YRS   = 25
export const SQFT_PER_KW   = 100     // rooftop area per kW of panels

// PM Surya Ghar — Yojana subsidy slabs for residential (₹) — capped at 3 kW / ₹78,000
export const SUBSIDY_SLABS = [
  { upToKw: 1, amountPerKw: 30000 },
  { upToKw: 2, amountPerKw: 30000 },
  { upToKw: 3, amountPerKw: 18000 },
]
export const SUBSIDY_CAP = 78000

// OPEX/PPA — typical bill discount (commercial / industrial only)
export const PPA_DISCOUNT  = 0.30    // PPA tariff ≈ 70% of state tariff

// Loan defaults
export const LOAN_RATE_DEFAULT  = 0.095 // 9.5% p.a.
export const LOAN_TENURE_OPTIONS = [3, 5, 7] as const
