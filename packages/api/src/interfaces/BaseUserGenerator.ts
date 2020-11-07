import Gravatar from 'gravatar'
import { BaseUser, UserInput, utils } from 'shared'
import { ObjectID } from 'mongodb'
import apiUtils from '../utils'
import { Plan } from 'shared'
import { User } from '../../../shared/dist/interfaces/userInterfaces'

export class UserHelper implements BaseUser {
  _id: ObjectID
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
  isAdmin: boolean
  publicKey: string
  privateKey: string
  plan: Plan
  static isValidUserInput = utils.isValidUserInput

  static hasValidPlan(user: User) {
    if (!user.plan) {
      return false
    }
    if (user.plan === 'trial') {
      if (!user.createdAt) {
        return false
      }
      const startDate = new Date(user.createdAt!).getTime()
      const today = Date.now()
      const days = 86400

      const diff = 30 * days
      if (startDate + diff > today) {
        return false
      } else {
        return true
      }
    }
    return true
  }

  static isValidKey(key: string) {
    const valid = apiUtils.verifyToken(key)
    if (valid.userId) {
      return true
    }
    return false
  }
  constructor({
    email,
    firstname,
    lastname,
    password,
    isAdmin,
    publicKey,
    privateKey,
    plan,
  }: UserInput) {
    this._id = new ObjectID()
    this.email = email.toLowerCase()
    this.isAdmin = isAdmin || false
    this.password = password
    this.firstname = firstname
    const keys = apiUtils.createClientKeys(this._id, this.email)
    this.publicKey = privateKey || keys.publicKey
    this.privateKey = publicKey || keys.privateKey
    this.lastname = lastname
    const gravatar = Gravatar.url(email.toLowerCase())
    this.avatar = gravatar
    this.plan = plan || 'trial'
  }

  async hashPassword() {
    const hash = await apiUtils.hashPassword(this.password)
    this.password = hash
  }
}
