import { ObjectID } from 'mongodb'
import { QuestionInput, QuestionType, SurveyResponseInput } from 'shared'
// import { Model } from 'mongoose'
import { SurveyQuestion } from '../entities/SurveyQuestion'
// import { ObjectID } from 'mongodb'

export class SurveyQuestionGenerator extends SurveyQuestion {
  static transformQuestions(questions: QuestionInput[], surveyId: ObjectID) {
    const output: SurveyQuestionGenerator[] = []

    for (const options of questions) {
      output.push(new SurveyQuestionGenerator({ ...options, surveyId }))
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
      const question = await SurveyQuestion.findOne(answer.questionId)
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
    surveyId: ObjectID
  }) {
    super()
    this._id = new ObjectID()
    this.surveyId = props.surveyId
    this.options = props.options
    this.title = props.title
    this.type = props.type
    this.answers = props.answers || []
  }
}
