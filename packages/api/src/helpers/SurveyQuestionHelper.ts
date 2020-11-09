import { QuestionInput, QuestionType, SurveyResponseInput } from 'shared'
import { ObjectID } from 'mongodb'
import SurveyQuestion from '../db/SurveyQuestion'

export class SurveyQuestionHelper {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
  _id: ObjectID
  static transformQuestions(questions: QuestionInput[]) {
    const output: SurveyQuestionHelper[] = []

    for (const options of questions) {
      output.push(new SurveyQuestionHelper(options))
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

  static async addAnswers(inputs: SurveyResponseInput) {
    for (let answer of inputs) {
      const question = await SurveyQuestion.findById(answer.questionId)
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
