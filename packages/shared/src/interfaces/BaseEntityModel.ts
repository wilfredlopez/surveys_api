import { ObjectId } from 'mongodb'

export interface BaseEntityModel {
  _id: ObjectId
  id: string
}
