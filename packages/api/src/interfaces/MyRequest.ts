import { Request } from 'express'
import * as core from 'express-serve-static-core'

import { User } from '../../../shared/dist/interfaces/userInterfaces'

export default interface MyRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string
  email?: string
  admin?: User
}
