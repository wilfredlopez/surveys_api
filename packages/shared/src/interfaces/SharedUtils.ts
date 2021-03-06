import {
  AnswerValue,
  OrganizedAnswers,
  ExpectedCreate,
} from './surveyInterfaces'
import { QuestionType, SurveyQuestionClient } from './SurveyQuestionModel'
import { UserInput, Plan } from './userInterfaces'
import { Validator } from '@wilfredlopez/react-utils'

export class SharedUtils {
  static isString = (id?: string) => typeof id === 'string' && id.trim() !== ''
  static isSurveyQuestionInput(quests?: SurveyQuestionClient[]) {
    if (!Array.isArray(quests)) {
      return false
    }
    if (quests.length === 0) {
      return false
    }
    for (let q of quests) {
      if (!SharedUtils.isValidQuestionType(q.type)) {
        return false
      }
      if (!SharedUtils.isString(q.title)) {
        return false
      }
      if (!Array.isArray(q.options)) {
        return false
      }
    }

    return true
  }
  static getUniqueAnswers(ans: string[]) {
    const unique: Record<string, AnswerValue> = {}

    for (let answer of ans) {
      if (unique[answer]) {
        unique[answer].count = unique[answer].count + 1
        continue
      }
      unique[answer] = {
        text: answer,
        count: 1,
      }
    }
    return Object.values(unique).sort(
      (a, b) => b.count - a.count
    ) as AnswerValue[]
  }

  static percentText(ans: AnswerValue, total: number) {
    let percent = (ans.count / total) * 100
    if (isNaN(percent)) {
      percent = 0
    }
    return `${ans.text} (${percent.toFixed(1)}%)`
  }
  static findMissingAnswers(
    MAP: Record<string, OrganizedAnswers>,
    questions: SurveyQuestionClient[]
  ) {
    const missing: Record<string, AnswerValue[]> = {} // output

    const orginized = Object.values(MAP)
    const selected: { [key: string]: string } = {}
    // add all selected answers to object
    for (const o of orginized) {
      for (let a of o.answers) {
        selected[a.text] = a.text
      }
    }

    const optionsArr = questions.map(q => ({ id: q.id, opt: q.options }))
    for (const option of optionsArr) {
      for (let q of option.opt) {
        if (!selected[q]) {
          if (Array.isArray(missing[option.id])) {
            missing[option.id].push({
              count: 0,
              text: q,
            })
          } else {
            missing[option.id] = [
              {
                count: 0,
                text: q,
              },
            ]
          }
        }
      }
    }

    return missing
  }

  static isValidQuestionType(t?: QuestionType | string): t is QuestionType {
    if (!t || typeof t !== 'string') return false
    return t === 'multi-choice' || t === 'open-answer' || t === 'single-choice'
  }
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

  static validateCreate(data: ExpectedCreate): [key: string, result: boolean] {
    const expected: { [K in keyof ExpectedCreate]: (data: any) => boolean } = {
      name: SharedUtils.isString,
      questions: SharedUtils.isSurveyQuestionInput,
      open: () => true,
    }
    let val: any
    let fn: (v: any) => boolean
    for (let key in expected) {
      val = data[key as keyof ExpectedCreate]
      fn = expected[key as keyof typeof expected]
      if (typeof val === 'undefined') {
        return [`${key} is undefined.`, false]
      }
      if (!fn(val)) {
        return [matchError(key), false]
      }
    }
    return ['', true]
  }

  static isValidPlan(plan: Plan) {
    return plan === 'monthly' || plan === 'trial' || plan === 'yearly'
  }
}

function matchError(key: string) {
  return key === 'name'
    ? 'Invalid name'
    : key === 'questions'
    ? 'Invalid Questions'
    : 'open should should boolean'
}
