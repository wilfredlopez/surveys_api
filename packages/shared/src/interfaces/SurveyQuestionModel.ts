import { ClientI } from './common'
import { Document } from 'mongoose'
export type QuestionType = 'multi-choice' | 'single-choice' | 'open-answer'

export interface RawSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
}

export interface SurveyQuestionClient extends RawSurveyQuestion, ClientI {}
export interface SurveyQuestionModel extends RawSurveyQuestion, Document {}
export interface QuestionInput extends Omit<RawSurveyQuestion, 'answers'> {
  answers?: string[]
}
