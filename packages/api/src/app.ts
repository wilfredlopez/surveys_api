import express from 'express'
import Router from './routes'
import cors from 'cors'

const app = express()

//Middlewares
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(express.json())

app.use(cors({}))

app.use(Router)

app.get('/', (_, res) => {
  res.json({
    surveys_api: 'Navigate to /surveys',
  })
})

export default app
