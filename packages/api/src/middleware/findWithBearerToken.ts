import { Request } from 'express'
import utils from '../utils'

export default function findWithBearerToken(req: Request) {
  const bearerBeader = req.headers['authorization']
  if (typeof bearerBeader !== 'undefined') {
    try {
      //split at the space
      const bearer = bearerBeader.split(' ')

      //get token from array
      const accessToken = bearer[1]

      if (!accessToken) {
        return null
      }

      return utils.verifyToken(accessToken)
    } catch {
      return null
    }
  }
  return null
}
