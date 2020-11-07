import { NextFunction, Response } from 'express'
import utils from '../utils/index'
import MyRequest from '../interfaces/MyRequest'

//WITH THIS METHOD THE USER NEEDS TO SEND THE HEADER "Authorization": "Bearer accesstokenhere"
export async function authMiddleware(
  req: MyRequest,
  _res: Response,
  next: NextFunction
) {
  const bearerBeader = req.headers['authorization']

  if (typeof bearerBeader !== 'undefined') {
    try {
      //split at the space
      const bearer = bearerBeader.split(' ')

      //get token from array
      const accessToken = bearer[1]

      if (!accessToken) {
        return next()
      }

      const { email, userId } = utils.verifyToken(accessToken)

      req.userId = userId
      req.email = email

      next()
    } catch (error) {
      next()
    }
  } else {
    next()
  }
}
