import { WithIdClient } from './common'
import { BaseEntityModel } from './BaseEntityModel'
export type QuestionType = 'multi-choice' | 'single-choice' | 'open-answer'

export interface RawSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
}

export interface SurveyQuestionClient extends RawSurveyQuestion, WithIdClient {}
export interface SurveyQuestionModel
  extends RawSurveyQuestion,
    BaseEntityModel {}
export interface QuestionInput extends Omit<RawSurveyQuestion, 'answers'> {
  answers?: string[]
}
