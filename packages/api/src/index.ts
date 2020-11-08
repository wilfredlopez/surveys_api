import 'reflect-metadata' // NEEDED FOR TYPEORM
import './env' //Initialize Enviroment Variables from 'dotenv'
import app from './app'
// import mongoose from 'mongoose'
// import { MONGOURL } from './env'
import initializers from './initializers'
import getConnection from './database/getConnection'

// Idea From: https://www.florin-pop.com/blog/2019/03/15-plus-app-ideas-to-build-to-level-up-your-coding-skills/
const PORT = process.env.PORT || 5200

// const options: mongoose.ConnectionOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }

getConnection()
  .then(async connection => {
    console.log('Database Ready.', `(type:${connection.options.type})`)

    app.listen(PORT, () => {
      console.log(`App ready. Listening on port ${PORT}`)

      initializers()
    })
  })
  .catch((e: unknown) => {
    console.error('Database Connection Error: \n', e)
  })
// mongoose
//   .connect(MONGOURL, options)
//   .then(() => {
//     console.log('MongoDB Ready')
//     app.listen(PORT, () => {
//       console.log(`App ready. Listening on port ${PORT}`)

//       initializers()
//     })
//   })
//   .catch(e => {
//     console.error('Mongodb Error: ', e)
//   })
