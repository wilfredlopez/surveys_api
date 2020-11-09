import UserDB from '../db/User'
import surveysDB from '../db/Survey'
import SurveyQuestion from '../db/SurveyQuestion'
import { SurveyModel, SurveyQuestionModel, UserModel } from 'shared'
import MongooseLoaderGenerator, {
  GenericModels,
  GenericLoaders,
  LoaderRecorType,
} from './MongooseLoaderGenerator'

export type DocumentTypes = [SurveyModel, UserModel, SurveyQuestionModel]
export type Models = GenericModels<DocumentTypes>
export type MyLoaders = GenericLoaders<DocumentTypes>
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

const MODELS: Models = [surveysDB, UserDB, SurveyQuestion]

interface RecordType extends LoaderRecorType<DocumentTypes> {
  surveyLoader: MyLoaders[0]
  userLoader: MyLoaders[1]
  surveyQuestionLoader: MyLoaders[2]
}

export class DatabaseLoaders extends MongooseLoaderGenerator<
  DocumentTypes,
  RecordType
> {
  constructor() {
    super(MODELS)
  }
  async initialize() {
    const loaders = this.createLoaders()
    this.loaders.surveyLoader = loaders[0]
    this.loaders.userLoader = loaders[1]
    this.loaders.surveyQuestionLoader = loaders[2]
    return this.loaders
  }
}
