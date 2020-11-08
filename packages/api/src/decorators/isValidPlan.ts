import { Plan } from 'shared/src/interfaces/userInterfaces'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

const MESSAGE = 'Text ($value) is not a valid plan!'

@ValidatorConstraint({ name: 'PlanValidator', async: false })
export default class PlanValidator implements ValidatorConstraintInterface {
  public validate(text: Plan) {
    return text === 'monthly' || text === 'trial' || text === 'yearly'
  }

  public defaultMessage(_args: ValidationArguments) {
    return MESSAGE
  }
}

export function isValidPlan(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PlanValidator,
    })
  }
}
