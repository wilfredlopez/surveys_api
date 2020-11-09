import { UserModel } from './userInterfaces'
import { Document } from 'mongoose'
import { WithTimeStamps, ClientI } from './common'
import {
  QuestionInput,
  SurveyQuestionModel,
  SurveyQuestionClient,
} from './SurveyQuestionModel'

export interface RawSurvey extends WithTimeStamps {
  name: string
  open: boolean
  questions: SurveyQuestionModel[]
  creatorId: UserModel['_id']
  creator?: UserModel | undefined
}

export interface SurveyModel extends RawSurvey, Document {}
export interface SurveyClient extends Omit<RawSurvey, 'questions'>, ClientI {
  questions: SurveyQuestionClient[]
}

export interface AnswerInput {
  questionId: string
  answer: string[]
}

export interface AnswerValue {
  text: string
  count: number
}

export interface OrganizedAnswers {
  total: number
  answers: AnswerValue[]
}

export type ExpectedCreate = {
  name: RawSurvey['name']
  open: boolean
  questions: QuestionInput[]
}

export type SurveyResponseInput = AnswerInput[]

export interface SurveyCreateResponse extends RawSurvey {
  _id: string
}
export interface SurveyCreateResponse {
  error?: string
}

export type SurveyUnpolulated = Exclude<RawSurvey, 'questions'> & {
  _id: string
  questions: string[]
}
