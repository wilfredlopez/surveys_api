import Gravatar from 'gravatar'
import { Validator } from '@wilfredlopez/react-utils'
import { Document } from 'mongoose'
import { ObjectID } from 'mongodb'

export interface UserInput {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface BaseUser {
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
}

export interface User extends Document, BaseUser {}

export class RawUser implements BaseUser {
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
