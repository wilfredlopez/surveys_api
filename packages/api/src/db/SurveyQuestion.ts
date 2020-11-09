import { SurveyQuestionModel } from 'shared'
import mongoose, { Schema } from 'mongoose'

const QuestionSchema: Schema = new Schema<SurveyQuestionModel>({
  title: { type: String, required: true },
  options: { type: [String], default: [] },
  type: { type: Schema.Types.String, required: true },
  answers: { type: [String], default: [] },
})

const SurveyQuestion = mongoose.model<SurveyQuestionModel>(
  'SurveyQuestion',
  QuestionSchema
)

export default SurveyQuestion
