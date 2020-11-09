import { NextFunction, Response } from 'express'
import MyRequest from '../interfaces'
import { DatabaseLoaders } from '../database-loaders/DatabaseLoaders'

const databaseLoaders = new DatabaseLoaders()
//WITH THIS METHOD THE USER NEEDS TO SEND THE HEADER "Authorization": "Bearer accesstokenhere"
export async function customRequestMiddlewares(
  req: MyRequest,
  _res: Response,
  next: NextFunction
) {
  await databaseLoaders.initialize()
  req.dataloaders = databaseLoaders
  next()
}
