import { WithTimeStamps } from './common'
import { BaseEntity } from 'typeorm'
import { WithId } from './WithId'
import { ClientI } from '../../dist/interfaces/client.interface'

export type Plan = 'yearly' | 'monthly' | 'trial'

export interface BaseUser extends WithTimeStamps {
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
  publicKey: string
  privateKey: string
  isAdmin?: boolean
  plan: Plan
}

export interface UserDB extends BaseUser, BaseEntity, WithId {}
export interface UserClient extends BaseUser, ClientI {}

export interface UserInput {
  firstname: string
  lastname: string
  email: string
  password: string
  isAdmin?: boolean
  publicKey?: string
  privateKey?: string
  plan?: Plan
}

interface WithUserDB {
  user: UserDB
}
interface WithUserClient {
  user: UserClient
}
export interface SuccessLogin extends WithUserDB {
  token: string
  error?: string
}
export interface SuccessLoginClient
  extends Omit<SuccessLogin, 'user'>,
    WithUserClient {}
export interface ErrorResponseClient
  extends Omit<ErrorResponse, 'user'>,
    Partial<WithUserClient> {}

export interface ErrorResponse extends Partial<WithUserDB> {
  token?: string
  error: string
}

export type LoginResponse = SuccessLogin | ErrorResponse
export type LoginResponseClient = SuccessLoginClient | ErrorResponseClient
