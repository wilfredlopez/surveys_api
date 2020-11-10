import { Request } from "express";
// import * as core from "express-serve-static-core";

import { User } from "../entities/User";
export default interface MyRequest<
  P = Request["params"],
  ResBody = any,
  ReqBody = any,
  ReqQuery = Request["query"]
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
  email?: string;
  admin?: User;
}

export type NullableRequired<T> = {
  [P in keyof T]-?: T[P] | null;
};

export type CustomRequestsNullable = NullableRequired<
  Omit<MyRequest, keyof Request>
>;
export type CustomRequestsRequired = Required<Omit<MyRequest, keyof Request>>;
