import mongoose, { Schema } from 'mongoose'
import { SurveyModel } from 'shared'

const SurveySchema: Schema = new Schema<SurveyModel>(
  {
    name: { type: String, required: true, index: true },
    open: { type: Boolean, default: false },
    creatorId: { type: Schema.Types.ObjectId, required: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'SurveyQuestion' }],
  },
  {
    timestamps: true,
  }
)

const Survey = mongoose.model<SurveyModel>('Survey', SurveySchema)

export default Survey
