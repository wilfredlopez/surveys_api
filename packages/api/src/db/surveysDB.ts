import mongoose, { Schema } from 'mongoose'
import { Survey } from 'shared'

const SurveySchema: Schema = new Schema<Survey>(
  {
    name: { type: String, required: true },
    open: { type: Boolean, default: false },
    creatorId: { type: Schema.Types.ObjectId, required: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'SurveyQuestion' }],
  },
  {
    timestamps: true,
  }
)

const surveyDB = mongoose.model<Survey>('Survey', SurveySchema)

export default surveyDB
