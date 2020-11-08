import dotenv from 'dotenv'

const EXPECTED_ENV_VARS = [
  'JWT_SECRET',
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
  'MONGO_HOSTNAME',
  'MONGO_PORT',
  'MONGO_DB',
]

// dotenv.config()
let path
switch (process.env.NODE_ENV) {
  case 'test':
    path = `${__dirname}/../.env.test`
    break
  case 'production':
    path = `${__dirname}/../.env.production`
    break
  default:
    // path = `${__dirname}/../.env.development`
    path = `${__dirname}/../.env`
}
dotenv.config({ path: path })

//MAKING SURE VARIABLES ARE DEFINED.
for (const variable of EXPECTED_ENV_VARS) {
  if (!process.env[variable]) {
    throw new Error(`process.env.${variable} is required.`)
  }
}

export const JWT_SECRET = process.env.JWT_SECRET!
export const MONGO_USERNAME = process.env.MONGO_USERNAME!
export const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME!
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD!
export const MONGO_PORT = process.env.MONGO_PORT!
export const MONGO_DB = process.env.MONGO_DB!

export const MONGOURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
