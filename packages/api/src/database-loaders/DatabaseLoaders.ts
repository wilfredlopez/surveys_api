import DataLoader from 'dataloader'
import { Model, Document, FilterQuery } from 'mongoose'
import UserDB from '../db/userDb'
import surveysDB from '../db/surveysDB'
import SurveyQuestionDB from '../db/SurveyQuestionDB'
import { Survey, SurveyQuestion, User } from 'shared'
import { GenLoaders, GenLoad, GenericLoader } from './genericTypes'

export type IdArray = string[]

export interface WithIds {
  _id: string
}

export type DocumentTypes = [Survey, User, SurveyQuestion]
export type Models = GenLoaders<DocumentTypes>
export type MyLoaders = GenLoad<DocumentTypes>
// type Models = readonly [
//   Model<DocumentTypes[0], {}>,
//   Model<DocumentTypes[1], {}>,
//   Model<DocumentTypes[2], {}>
// ]
// type MyLoaders = [
//   GenericLoader<Models[0]>,
//   GenericLoader<Models[1]>,
//   GenericLoader<Models[2]>
// ]

const LOADERS: Models = [surveysDB, UserDB, SurveyQuestionDB]

export class DatabaseLoaders {
  public surveyLoader: DataLoader<string, DocumentTypes[0]>
  public userLoader: DataLoader<string, DocumentTypes[1]>
  public surveyQuestionLoader: DataLoader<string, DocumentTypes[2]>
  public async initialize() {
    const loaders = this.createLoaders()
    this.surveyLoader = loaders[0]
    this.userLoader = loaders[1]
    this.surveyQuestionLoader = loaders[2]
  }

  private createMap<T extends WithIds>(entities: T[]) {
    const mapObject: { [key: string]: T } = {}

    for (let entity of entities) {
      mapObject[entity._id] = entity
    }
    return mapObject
  }
  private mapIds<T extends WithIds>(
    ids: IdArray,
    mapObject: {
      [key: string]: T
    }
  ) {
    return ids.map(id => mapObject[id])
  }
  private generateBatch<T extends WithIds>(array: T[], ids: IdArray) {
    const userMap = this.createMap(array)
    return this.mapIds(ids, userMap)
  }
  private async batchGeneric<Entity extends Document>(
    model: Model<Entity, {}>,
    ids: IdArray
  ) {
    const query: FilterQuery<{}> = {
      _id: {
        $in: ids,
      },
    }
    const entities = await model.find(query)
    return this.generateBatch(entities, ids)
  }

  private createLoaders() {
    const output: GenericLoader<any>[] = [] as any

    for (let loader of LOADERS) {
      output.push(this.createLoader(loader as any))
    }

    return output as MyLoaders
  }

  private createLoader<DocType extends Document>(MongoModel: Model<DocType>) {
    const loader = new DataLoader<string, DocType>(keys => {
      return this.batchGeneric(MongoModel, keys as IdArray)
    })

    return loader
  }
}
