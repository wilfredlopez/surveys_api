import { Request } from 'express'
export default interface MyRequest extends Request {
  userId?: string
  email?: string
}
