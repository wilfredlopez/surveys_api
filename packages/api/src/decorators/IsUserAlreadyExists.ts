import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { User } from '../entities/User'

interface UserValidationArguments extends ValidationArguments {
  type?: 'admin' | 'default'
}

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(email: string, { type }: UserValidationArguments) {
    const shouldBeAdmin = type === 'admin'
    return User.findOne({ email: email }).then(user => {
      if (!user) return false
      if (shouldBeAdmin) {
        if (typeof user.isAdmin === 'undefined' || user.isAdmin === false) {
          return false
        }
      }
      return true
    })
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    })
  }
}
