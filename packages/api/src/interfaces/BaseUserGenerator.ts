import Gravatar from 'gravatar'
import { BaseUser, UserInput } from 'shared'
import { Validator } from '@wilfredlopez/react-utils'
import { ObjectID } from 'mongodb'

export class BaseUserGenerator implements BaseUser {
  _id: ObjectID
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
  static isValidUserInput(
    input?: Partial<UserInput>
  ): [valid: boolean, message: string] {
    if (!input) {
      return [false, 'input not defined']
    }
    if (!Validator.isEmail(input.email)) {
      return [false, 'invalid email']
    }
    if (
      !input.firstname ||
      input.firstname.trim() === '' ||
      !input.lastname ||
      input.lastname.trim() === ''
    ) {
      return [false, 'first and last name most not be empty']
    }
    if (!input.password || input.password.length < 5) {
      return [false, 'invalid password. lenght should be greater than 4']
    }
    return [true, '']
  }
  constructor({ email, firstname, lastname, password }: UserInput) {
    this.email = email.toLowerCase()

    this.password = password
    this.firstname = firstname
    this.lastname = lastname
    const gravatar = Gravatar.url(email.toLowerCase())
    this.avatar = gravatar
    this._id = new ObjectID()
  }
}
