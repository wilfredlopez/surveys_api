import { SurveyQuestion } from '../../interfaces'

export interface OptionProps {
  options: SurveyQuestion['options']
  setAnswer: (ans: string) => void
}
