import { UserDB } from './userInterfaces'
import { BaseEntity } from 'typeorm'
import { ClientI } from './client.interface'
import { WithTimeStamps } from './common'
import { WithId } from './WithId'
import {
  QuestionInput,
  SurveyQuestionClient,
  SurveyQuestionDB,
} from './SurveyQuestion'

export interface RawSurvey extends WithTimeStamps {
  name: string
  open: boolean
  questions: SurveyQuestionDB[]
  creatorId: UserDB['_id']
  creator?: UserDB | undefined
}

export interface SurveyDB extends RawSurvey, BaseEntity, WithId {}
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

export interface SurveyCreateResponse extends RawSurvey, ClientI {}
export interface SurveyCreateResponse {
  error?: string
}

export type SurveyUnpolulated = Exclude<RawSurvey, 'questions'> & {
  questions: string[]
  _id: string
}
