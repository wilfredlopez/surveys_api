import { RequestHandler } from 'express'
import { UserHelper } from '../../helpers'
import { UserModel, UserInput } from 'shared'
import apiUtils from '../../apiUtils/index'
import User from '../../db/User'
import MyRequest from '../../interfaces'
import { BaseRoute } from '../BaseRoute'
// import { ObjectID } from 'mongodb'

interface UserWithToken {
  user: UserModel
  token: string
}

interface ErrorResponse {
  error: string
}

export type LoginResponse = UserWithToken | ErrorResponse

class AuthRoutes extends BaseRoute {
  allUsers: RequestHandler = async (_req, res) => {
    const users = await User.find({})
    res.json(users)
  }
  me: RequestHandler<{}, LoginResponse> = async (req: MyRequest, res) => {
    const userId = req.userId
    if (userId) {
      // const id = new ObjectID(userId)

      try {
        const user = await req.dataloaders!.loaders.userLoader.load(userId)
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
        return this.unauthorizedReturn(res)
      }
    } else {
      return this.unauthorizedReturn(res)
    }
  }
  removeUser: RequestHandler<{ id: string }> = async (
    req: MyRequest<{ id: string }>,
    res
  ) => {
    const userId = req.userId
    const { id } = req.params

    if (!userId) {
      return this.unauthorizedReturn(res)
    }

    const user = await req.dataloaders!.loaders.userLoader.load(id)

    // const user = await User.findOne({
    //   _id: id,
    // })

    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      })
    }

    function isAdminOrIsSameUser(user: UserModel, id: string) {
      if (!user) {
        return false
      }
      if (user._id === id) {
        return true
      }
      if (user.isAdmin) {
        return true
      }

      return false
    }

    if (isAdminOrIsSameUser(user, userId)) {
      const deleted = await user.remove()
      return res.json(deleted)
    } else {
      return this.unauthorizedReturn(res)
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

      const user = await User.findOne({ email: data.email })
      if (!user) {
        return res.status(404).json({
          error: 'User not found.',
        })
      }

      const isValidPassword = await apiUtils.isValidPassword(
        data.password,
        user.password
      )

      if (!isValidPassword) {
        return this.unauthorizedReturn(res)
      }

      const { accessToken } = apiUtils.createToken(user)

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
  updateClientKeys: RequestHandler<{ id: string }> = async (
    req: MyRequest<{ id: string }>,
    res
  ) => {
    try {
      const { id } = req.params
      const admin = req.admin

      if (!admin) {
        return this.unauthorizedReturn(
          res,
          'Only admin users can make this action.'
        )
      }

      // const client = await User.findOne({ _id: id })
      const client = await req.dataloaders!.loaders.userLoader.load(id)
      if (!client) {
        return res.status(404).json({
          error: 'Client not found.',
        })
      }

      const { privateKey, publicKey } = apiUtils.createClientKeys(
        client._id,
        client.email
      )

      client.publicKey = publicKey
      client.privateKey = privateKey
      await client.save()
      return res.json(client)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        })
      }
      return res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  makeUserAdmin: RequestHandler<{ id: string }, LoginResponse> = async (
    req: MyRequest<{ id: string }>,
    res
  ) => {
    const id = req.params.id
    const administrator = await req.dataloaders!.loaders.userLoader.load(
      req.userId!
    )
    // const administrator = await User.findOne({
    //   _id: req.userId,
    // })

    if (!administrator || !administrator.isAdmin) {
      return this.unauthorizedReturn(
        res,
        'You Most be an administrator in order to perform this request'
      )
    }

    try {
      const user = await req.dataloaders!.loaders.userLoader.load(id)
      // const user = await User.findOne({
      //   _id: id,
      // })
      if (!user) {
        return res.json({
          error: 'User Not Found.',
        })
      }
      user.isAdmin = true
      await user.save()
      return res.json({
        user: user,
        token: '',
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        })
      } else {
        return res.status(500).json({
          error: 'Internal server error.',
        })
      }
    }
  }
  register: RequestHandler<{}, LoginResponse> = async (req, res) => {
    try {
      const data = req.body as UserInput
      const [isValidUser, errMessage] = UserHelper.isValidUserInput(data)
      if (!isValidUser) {
        return res.status(400).json({
          error: errMessage,
        })
      }
      //Prevent Setting Admin and Plan for User
      data.isAdmin = false
      data.plan = 'trial'
      const rawUser = new UserHelper(data)
      await rawUser.hashPassword()
      const user = await User.create(rawUser)
      await user.save()
      const { accessToken } = apiUtils.createToken(user)
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
