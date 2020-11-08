import { User } from './userInterfaces'
import { Document } from 'mongoose'
import { ClientI } from './client.interface'
import { WithTimeStamps } from './common'

export type QuestionType = 'multi-choice' | 'single-choice' | 'open-answer'

export interface RawSurvey extends WithTimeStamps {
  name: string
  open: boolean
  questions: SurveyQuestion[]
  creatorId: User['_id']
  creator?: User | undefined
}

export interface RawSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
}

export interface Survey extends RawSurvey, Document {}
export interface SurveyClient extends Omit<RawSurvey, 'questions'>, ClientI {
  questions: SurveyQuestionClient[]
}

export interface SurveyQuestion extends RawSurveyQuestion, Document {}
export interface SurveyQuestionClient extends RawSurveyQuestion, ClientI {}

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

export interface QuestionInput extends Omit<RawSurveyQuestion, 'answers'> {
  answers?: string[]
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
