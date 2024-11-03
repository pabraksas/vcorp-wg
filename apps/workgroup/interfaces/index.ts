///////////////////////////////////////////////////////////////////////////////////////////////////

import type { Argv, Arguments, CamelCaseKey } from 'yargs'

/** @internal */
export type OptionsFunction<TArgs> = (yargs: Argv) => Argv<TArgs>

/** @internal */
export type ArgsFromOptions<TOptionsFunction extends OptionsFunction<any>> =
  TOptionsFunction extends OptionsFunction<infer U> ? Args<U> : never

/** @internal */
export type Args<TArgs> = {
  [key in keyof Arguments<TArgs> as key | CamelCaseKey<key>]: Arguments<TArgs>[key]
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// export type { Config } from "./configSchema.js";

/** @internal */
export type Invoice = {
  id: string // Will be created on the database
  customer_id: string
  amount: number // Stored in cents
  status: 'pending' | 'paid'
  date: string
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export type Config = {
  config: string
}

export type User = {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  config: Config
  updated_at: string
}

export type Meeting = {
  primary: boolean
  name: string
  description: string | undefined
  timezone: string
  year: number
  month: number
  date: number
  /** Range, 24h */
  time: string
  filenameFragment: string
  config: Config
}

export type Workgroup = {
  id: number
  name: string
  text: string | undefined
  config: Config
  updated_at: string
}

///////////////////////////////////////////////////////////////////////////////////////////////////
