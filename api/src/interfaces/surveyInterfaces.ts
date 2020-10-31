// import { v4 } from 'uuid'
import { User } from './userInterfaces'
export type QuestionType = 'multi-choice' | 'single-choice' | 'open-answer'
import { Document, Model } from 'mongoose'
import { ObjectID } from 'mongodb'

export function isValidQuestionType(t?: QuestionType | string) {
  if (!t || typeof t !== 'string') return false
  return t === 'multi-choice' || t === 'open-answer' || t === 'single-choice'
}

export interface RawSurvey {
  name: string
  open: boolean
  questions: SurveyQuestion[]
  creatorId: User['_id']
  creator?: User
  createdAt?: string
  updatedAt?: string
}

export interface Survey extends Document {
  name: string
  open: boolean
  questions: SurveyQuestion[]
  creatorId: any
  creator?: User | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

// export interface SurveyAnswer extends SurveyQuestion {
//   answer: string[]
// }

interface QuestionInput {
  title: string
  options: string[]
  type: QuestionType
  answers?: string[]
}

export interface RawSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
}

export class SurveyQuestion extends Document {
  title: string
  options: string[] = []
  type: QuestionType
  answers: string[] = []
}

export class BaseSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
  _id: ObjectID
  static transformQuestions(questions: QuestionInput[]) {
    const output: BaseSurveyQuestion[] = []

    for (const options of questions) {
      output.push(new BaseSurveyQuestion(options))
    }
    return output
  }

  static isValidAnswerInput(inputs?: SurveyResponseInput) {
    if (!inputs) {
      return false
    }
    if (Array.isArray(inputs) === false) {
      return false
    }
    for (let input of inputs) {
      if (!input.answer || !input.questionId) {
        return false
      }
      if (!Array.isArray(input.answer)) {
        return false
      }
    }
    return true
  }

  // static async addAnswers(
  //   SurveyQuestionDB: Model<SurveyQuestion, {}>,
  //   inputs: SurveyResponseInput
  // ) {
  //   for (let answer of inputs) {
  //     const question = await SurveyQuestionDB.findById(answer.questionId)
  //     if (question) {
  //       question.answers.push(answer.answer)
  //       question.save()
  //     }
  //   }
  // }
  static async addAnswers(
    SurveyQuestionDB: Model<SurveyQuestion>,
    inputs: SurveyResponseInput
  ) {
    for (let answer of inputs) {
      const question = await SurveyQuestionDB.findById(answer.questionId)
      if (question) {
        for (let val of answer.answer) {
          question.answers.push(val)
        }
        question.save()
      }
    }
  }
  constructor(props: {
    title: string
    options: string[]
    type: QuestionType
    answers?: string[]
  }) {
    this._id = new ObjectID()
    this.options = props.options
    this.title = props.title
    this.type = props.type
    this.answers = props.answers || []
  }
}

interface AnswerInput {
  questionId: string
  answer: string[]
}

export type SurveyResponseInput = AnswerInput[]
