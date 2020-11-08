import { Request } from 'express'
import * as core from 'express-serve-static-core'
import { UserDB } from 'shared'

export default interface MyRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string
  email?: string
  admin?: UserDB
}
