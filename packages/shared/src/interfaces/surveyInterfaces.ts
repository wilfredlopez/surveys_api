import { UserModel } from './userInterfaces'
import { WithTimeStampsServer, WithIdClient } from './common'
import { Collection } from '@mikro-orm/core'
import { BaseEntityModel } from './BaseEntityModel'
import {
  QuestionInput,
  SurveyQuestionModel,
  SurveyQuestionClient,
} from './SurveyQuestionModel'

export interface RawSurvey extends WithTimeStampsServer {
  name: string
  open: boolean
  creator?: UserModel | undefined
}

export interface SurveyModel extends RawSurvey, BaseEntityModel {
  questions: Collection<SurveyQuestionModel>
}
export interface SurveyClient
  extends Omit<RawSurvey, 'questions'>,
    WithIdClient {
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

export interface SurveyCreateResponse extends RawSurvey, WithIdClient {}
export interface SurveyCreateResponse {
  error?: string
}

export type SurveyUnpolulated = Exclude<RawSurvey, 'questions'> & {
  id: string
  questions: any[]
}
