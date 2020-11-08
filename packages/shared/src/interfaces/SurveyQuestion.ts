import { WithId } from './WithId'
import { BaseEntity } from 'typeorm'
import { ClientI } from './client.interface'
import { ObjectID } from 'mongodb'

export type QuestionType = 'multi-choice' | 'single-choice' | 'open-answer'

export interface RawSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
  surveyId: ObjectID
}
export interface RawSurveyQuestionClient
  extends Omit<RawSurveyQuestion, 'surveyId'> {
  surveyId: string
}

export interface SurveyQuestionDB
  extends RawSurveyQuestion,
    BaseEntity,
    WithId {}
export interface SurveyQuestionClient
  extends RawSurveyQuestionClient,
    ClientI {}

export interface QuestionInput
  extends Omit<RawSurveyQuestion, 'answers' | '_id' | 'surveyId'> {
  answers?: string[]
}
