// import { v4 } from 'uuid'
import { User } from './userinterfaces'
export type QuestionType = 'multi-choice' | 'single-choice' | 'open-answer'

export function isValidQuestionType(t?: QuestionType | string) {
  if (!t || typeof t !== 'string') return false
  return t === 'multi-choice' || t === 'open-answer' || t === 'single-choice'
}

export interface RawSurvey {
  name: string
  open: boolean
  questions: SurveyQuestion[]
  creatorId: User['_id']
  creator?: User
  createdAt?: string
  updatedAt?: string
}

export interface Survey {
  _id: string
  name: string
  open: boolean
  questions: SurveyQuestion[]
  creatorId: any
  creator?: User | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export interface QuestionInput {
  title: string
  options: string[]
  type: QuestionType
  answers?: string[]
}

export type ExpectedCreate = {
  name: Survey['name']
  open: boolean
  questions: QuestionInput[]
}

export interface RawSurveyQuestion {
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
}

export interface SurveyQuestion {
  _id: string
  title: string
  options: string[]
  type: QuestionType
  answers: string[]
}

export interface AnswerInput {
  questionId: string
  answer: string[]
}

export type SurveyResponseInput = AnswerInput[]

export interface SurveyCreateResponse extends Survey {}
export interface SurveyCreateResponse {
  error?: string
}

export type SurveyUnpolulated = Exclude<Survey, 'questions'> & {
  questions: string[]
}
