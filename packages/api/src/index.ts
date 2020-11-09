import './env' //Initialize Enviroment Variables from 'dotenv'
import app from './app'
import mongoose from 'mongoose'
import { MONGOURL } from './env'
import initializers from './initializers'

// Idea From: https://www.florin-pop.com/blog/2019/03/15-plus-app-ideas-to-build-to-level-up-your-coding-skills/
const PORT = process.env.PORT || 5200

const options: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose
  .connect(MONGOURL, options)
  .then(async () => {
    console.log('MongoDB Ready')
    await initializers()
    app.listen(PORT, () => {
      console.log(`App ready. Listening on port ${PORT}`)
    })
  })
  .catch(e => {
    console.error('Mongodb Error: ', e)
  })
