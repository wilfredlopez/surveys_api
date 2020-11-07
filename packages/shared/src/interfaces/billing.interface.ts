import { Validator } from '@wilfredlopez/react-utils'
import { Plan } from './userInterfaces'
export interface BillingInfo {
  firstname: string
  lastname: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  creditCard: string
  cvv: string
  expiration: string
}

export const US_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
} as const

export type USState = keyof typeof US_STATES
export const US_STATE_KEYS = Object.keys(US_STATES) as USState[]

export function customValidate<K extends keyof BillingInfo>(
  key: K,
  value: BillingInfo[K]
) {
  if (!value || value.trim() === '') {
    return false
  }
  if (key === 'state') {
    return isValidState(value)
  }
  if (key === 'zipcode') {
    return Validator.isPostalCode(value, 'US')
  }
  if (key === 'creditCard') {
    const val = +value
    if (isNaN(val)) {
      return false
    }
    return Validator.minLength(value, 14)
  }
  if (key === 'cvv') {
    const l = value.length
    const n = +value
    if (isNaN(n)) {
      return false
    }
    if (l > 4) {
      return false
    }

    return true
  }

  if (key === 'expiration') {
    const expDate = new Date(value)
    if (expDate.toString() === 'Invalid Date') {
      return false
    }
    return Validator.isDate(value, 'MM/DD/YYYY')
  }

  return true
}

export function isValidState(state: string) {
  return US_STATE_KEYS.includes(state as any)
}

const defaultBilling: BillingInfo = {
  address1: '',
  address2: '',
  city: '',
  state: 'NJ',
  creditCard: '',
  cvv: '',
  expiration: '',
  firstname: '',
  lastname: '',
  zipcode: '',
}

export function validateBillingInfo(
  info: BillingInfo
): [isValid: boolean, errors: (keyof BillingInfo)[]] {
  const Keys = Object.keys(defaultBilling) as (keyof BillingInfo)[]
  let isValid = true
  const invalidKeys: (keyof BillingInfo)[] = []
  for (const k of Keys) {
    const current = info[k]
    if (typeof current === 'undefined') {
      isValid = false
      invalidKeys.push(k)
      continue
    }
    if (current.trim() === '') {
      isValid = false
      invalidKeys.push(k)
      continue
    }
    if (!customValidate(k, current)) {
      isValid = false
      invalidKeys.push(k)
      continue
    }
  }

  return [isValid, invalidKeys]
}

export interface PlaceOrderRequesInput {
  billing: BillingInfo
  plan: Plan
}
