import { WithTimeStampsServer, WithIdClient } from './common'
import { BaseEntityModel } from './BaseEntityModel'

export type Plan = 'yearly' | 'monthly' | 'trial'

export interface BaseUser extends WithTimeStampsServer {
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

export interface UserModel extends BaseUser, BaseEntityModel {}
export interface UserClient extends BaseUser, WithIdClient {}

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

export interface SuccessLogin {
  user: UserModel
  token: string
  error?: string
}

export interface ErrorResponse {
  user?: UserModel
  token?: string
  error: string
}
export interface ErrorResponseClient {
  user?: UserModel
  token?: string
  error: string
}

export interface SuccessLoginClient {
  user: UserClient
  token: string
  error?: string
}

export type LoginResponse = SuccessLogin | ErrorResponse
export type LoginResponseClient = SuccessLoginClient | ErrorResponseClient
