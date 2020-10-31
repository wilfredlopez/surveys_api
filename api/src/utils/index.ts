import jwt from 'jsonwebtoken'
import { User } from '../interfaces/userInterfaces'
import bcrypt from 'bcryptjs'

import { JWT_SECRET } from '../env'

class UtilsBase {
  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  }

  async isValidPassword(password: string, correctPassword: string) {
    const validPassword = await bcrypt.compare(password, correctPassword)

    return validPassword
  }

  createToken(user: User) {
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
