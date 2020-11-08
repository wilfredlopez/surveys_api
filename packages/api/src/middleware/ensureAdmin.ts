import { Response, NextFunction } from 'express'
import MyRequest from '../interfaces/MyRequest'
import { User } from '../entities/User'

export async function ensureAdmin(
  req: MyRequest,
  res: Response,
  next: NextFunction
) {
  const admin = await User.findOne(req.userId)

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
