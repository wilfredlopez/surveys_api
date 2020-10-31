export interface UserInput {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
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
