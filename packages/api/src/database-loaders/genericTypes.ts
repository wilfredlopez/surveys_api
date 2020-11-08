import DataLoader from 'dataloader'
import { Model, Document } from 'mongoose'

export type GenericLoader<T> = DataLoader<string, T, string>

export type GenLoaders<T extends Document[]> = {
  readonly //@ts-ignore
  [K in keyof T]: Model<T[K], {}>
}

export type GenLoad<T extends Document[]> = {
  [K in keyof T]: GenericLoader<T[K]>
}
