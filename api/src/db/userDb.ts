import { User } from '../interfaces/userInterfaces'
import mongoose, { Schema } from 'mongoose'

const UserSchema: Schema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
})

const userDb = mongoose.model<User>('User', UserSchema)

export default userDb
