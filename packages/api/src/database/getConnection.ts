import path from 'path'
import { createConnection, ConnectionOptions } from 'typeorm'
// import { Photo } from '../entities/Photo'
import { MONGOURL } from '../env'
const entitiesPath = path.join(__dirname, '..', 'entities')

const SHARED_OPTIONS: Partial<Omit<ConnectionOptions, 'type' | 'database'>> = {
  name: 'default',
  entities: [path.join(entitiesPath, '*.[t|j]s')],
  // entities: [Photo],
  logging: true,
  synchronize: false,
  // dropSchema: true,
  // subscribers: [`${join(entitiesPath, '')}`],
  // migrations: ['src/migration/*.js'],
}

const getDevConnection = () =>
  createConnection({
    ...SHARED_OPTIONS,
    type: 'sqlite',
    database: `${__dirname}/mydb.sql`,
  })

const getProductionConnection = () =>
  createConnection({
    ...SHARED_OPTIONS,
    type: 'mongodb',
    url: MONGOURL,
    authSource: 'admin',
    useUnifiedTopology: true,
  })

export default function getConnection() {
  if (process.env.NODE_ENV === 'production') {
    return getProductionConnection()
  } else {
    return getDevConnection()
  }
}
