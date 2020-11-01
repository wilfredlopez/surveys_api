import { RequestHandler } from 'express'
import { BaseUserGenerator, User, UserInput } from '../../interfaces'
import utils from '../../utils/index'
import userDb from '../../db/userDb'

interface UserWithToken {
  user: User
  token: string
}

interface ErrorResponse {
  error: string
}

export type LoginResponse = UserWithToken | ErrorResponse

class AuthRoutes {
  me: RequestHandler<{}, LoginResponse> = async (req, res) => {
    const userId = (req as any).userId as string | undefined
    if (userId) {
      try {
        const user = await userDb.findById(userId)
        if (!user) {
          return res.status(404).json({
            error: 'User Not Found.',
          })
        }

        return res.json({
          user: user,
          token: '',
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(401).json({
            error: error.message,
          })
        }
        return res.status(500).json({
          error: 'Unauthorized',
        })
      }
    } else {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }
  }
  login: RequestHandler<{}, LoginResponse> = async (req, res) => {
    try {
      const data = req.body as { email: string; password: string }
      if (!data.email || !data.password) {
        return res.status(400).json({
          error: 'Email and password most be sent in request body.',
        })
      }

      const user = await userDb.findOne({ email: data.email })
      if (!user) {
        return res.status(404).json({
          error: 'User not found.',
        })
      }

      const isValidPassword = await utils.isValidPassword(
        data.password,
        user.password
      )

      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Unauthorized.',
        })
      }

      const { accessToken } = utils.createToken(user)
      return res.json({
        user: user,
        token: accessToken,
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }
  register: RequestHandler<{}, LoginResponse> = async (req, res) => {
    try {
      const data = req.body as UserInput
      const [isValidUser, errMessage] = BaseUserGenerator.isValidUserInput(data)
      if (!isValidUser) {
        return res.status(400).json({
          error: errMessage,
        })
      }
      const password = await utils.hashPassword(data.password)
      data.password = password
      const rawUser = new BaseUserGenerator(data)
      const user = await userDb.create(rawUser)
      await user.save()
      const { accessToken } = utils.createToken(user)
      // userDb.save()
      return res.json({
        user: user,
        token: accessToken,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        })
      } else {
        return res.status(500).json({
          error: 'Could not register user.',
        })
      }
    }
  }
}

const authRoutes = new AuthRoutes()

export default authRoutes
