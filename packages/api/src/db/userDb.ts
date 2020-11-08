import { User } from '../interfaces/'
import mongoose, { Schema } from 'mongoose'
import { Plan } from 'shared'

const PlanEnum: Plan[] = ['monthly', 'yearly', 'trial']

const UserSchema: Schema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    isAdmin: { type: Boolean, required: false, default: false },
    plan: { type: String, required: true, enum: PlanEnum },
  },
  {
    timestamps: true,
  }
)

const userDb = mongoose.model<User>('User', UserSchema)

export default userDb
