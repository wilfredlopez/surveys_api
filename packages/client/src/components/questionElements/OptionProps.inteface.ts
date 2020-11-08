import { SurveyQuestionClient } from 'shared'

export interface OptionProps {
  options: SurveyQuestionClient['options']
  setAnswer: (ans: string) => void
}
