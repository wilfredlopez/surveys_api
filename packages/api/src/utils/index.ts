import jwt from 'jsonwebtoken'
import { UserDB } from 'shared'
import bcrypt from 'bcryptjs'

import { JWT_SECRET } from '../env'
import { ObjectID } from 'mongodb'

class UtilsBase {
  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  }

  async isValidPassword(password: string, correctPassword: string) {
    const validPassword = await bcrypt.compare(password, correctPassword)

    return validPassword
  }

  createClientKeys(userId: string | ObjectID, email: string) {
    const publicKey = jwt.sign({ userId: userId, email: email }, JWT_SECRET, {
      // expiresIn: '30min',
      expiresIn: '30days',
    })
    const privateKey = jwt.sign({ userId: userId, email: email }, JWT_SECRET, {
      // expiresIn: '30min',
      expiresIn: '1year',
    })

    return { publicKey, privateKey }
  }

  createToken(user: UserDB) {
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        // expiresIn: '30min',
        expiresIn: '1day',
      }
    )

    return { accessToken }
  }

  verifyToken(accessToken: string) {
    const data = jwt.verify(accessToken, JWT_SECRET!) as {
      userId?: string
      email?: string
    }

    return data
  }
}

const utils = new UtilsBase()

export default utils