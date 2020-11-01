import {
  QuestionInput,
  QuestionType,
  SurveyQuestion,
  SurveyResponseInput,
} from 'shared'
import { Model } from 'mongoose'
import { ObjectID } from 'mongodb'

export class SurveyQuestionGenerator {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
  _id: ObjectID
  static transformQuestions(questions: QuestionInput[]) {
    const output: SurveyQuestionGenerator[] = []

    for (const options of questions) {
      output.push(new SurveyQuestionGenerator(options))
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
