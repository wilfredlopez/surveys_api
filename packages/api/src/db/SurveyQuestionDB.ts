import { SurveyQuestion } from '../interfaces'
import mongoose, { Schema } from 'mongoose'

const QuestionSchema: Schema = new Schema<SurveyQuestion>({
  title: { type: String, required: true },
  options: { type: [String], default: [] },
  type: { type: Schema.Types.String, required: true },
  answers: { type: [String], default: [] },
})

const SurveyQuestionDB = mongoose.model<SurveyQuestion>(
  'SurveyQuestion',
  QuestionSchema
)

export default SurveyQuestionDB
