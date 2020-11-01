import { Document } from 'mongoose'
export interface BaseUser {
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
}

export interface User extends BaseUser, Document {}
export interface UserClient extends BaseUser {
  _id: string
}

export interface UserInput {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface SuccessLogin {
  user: User
  token: string
  error?: string
}

export interface ErrorResponse {
  user?: User
  token?: string
  error: string
}

export type LoginResponse = SuccessLogin | ErrorResponse
