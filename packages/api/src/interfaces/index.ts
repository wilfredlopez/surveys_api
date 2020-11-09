import { Request } from 'express'
import * as core from 'express-serve-static-core'

import { UserModel } from 'shared'
import { DatabaseLoaders } from '../database-loaders/DatabaseLoaders'

export default interface MyRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string
  email?: string
  admin?: UserModel
  dataloaders?: DatabaseLoaders
}

export type NullableRequired<T> = {
  [P in keyof T]-?: T[P] | null
}

export type CustomRequestsNullable = NullableRequired<
  Omit<MyRequest, keyof Request>
>
export type CustomRequestsRequired = Required<Omit<MyRequest, keyof Request>>
