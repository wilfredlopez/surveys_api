import { Response, NextFunction } from 'express'
import MyRequest from '../interfaces/MyRequest'
import userDb from '../db/userDb'

export async function ensureAdmin(
  req: MyRequest,
  res: Response,
  next: NextFunction
) {
  const admin = await userDb.findOne({
    _id: req.userId,
  })
  if (admin && admin.isAdmin) {
    req.admin = admin
    return next()
  } else {
    res
      .status(401)
      .json({
        error: 'Unauthorized',
      })
      .end()
  }
}
