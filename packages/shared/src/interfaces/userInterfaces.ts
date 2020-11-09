import { Document } from 'mongoose'
import { WithTimeStamps } from './common'

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

export interface UserModel extends BaseUser, Document {}
export interface UserClient extends BaseUser {
  _id: string
}

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

export type LoginResponse = SuccessLogin | ErrorResponse
