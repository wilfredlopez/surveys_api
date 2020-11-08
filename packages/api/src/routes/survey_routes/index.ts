import { RequestHandler, Request } from 'express'
import SurveyQuestionDB from '../../db/SurveyQuestionDB'
import { RawSurvey } from '../../interfaces'
import surveyDB from '../../db/surveysDB'
import { SurveyResponseInput } from '../../interfaces/index'
import {
  SurveyQuestionClient,
  SurveyQuestionGenerator,
} from '../../interfaces/index'
import { utils, ExpectedCreate, User, Survey } from 'shared'
import MyRequest from '../../interfaces/MyRequest'
import userDb from '../../db/userDb'
import { UserHelper } from '../../interfaces/BaseUserGenerator'
import { BaseRoute } from '../BaseRoute'

function deleteProp<T extends {} = any>(obj: T, key: keyof T) {
  if (obj[key]) {
    delete obj[key]
  }
}

export type SurveyCreateResponse = Survey | { error: string }

class SurveyRoutes extends BaseRoute {
  async validateClientKey(req: Request): Promise<string | User> {
    const publicKey = req.query.publicKey as string | undefined

    if (!publicKey) {
      return 'publicKey Most be sent with the request.'
    }

    const client = await userDb.findOne({
      publicKey: publicKey,
    })

    if (!client) {
      return `Client Not found with publicKey`
    }
    const isValidKey = UserHelper.isValidKey(client.publicKey)

    if (!isValidKey) {
      return `publicKey Expired.`
    }
    return client
  }
  getOpen: RequestHandler = async (req, res) => {
    try {
      const client = await this.validateClientKey(req)
      if (typeof client === 'string') {
        return res.status(404).json({
          error: client,
        })
      }

      const surveys = await surveyDB.find(
        { open: true, creator: client.id },
        {},
        { populate: 'questions' }
      )

      return res.json({
        surveys,
      })
    } catch (error) {
      console.error(error)

      return this.unknownError(res, {
        surveys: [],
        error: 'Internal Server Error',
      })
    }
  }

  mySurveys: RequestHandler = async (req: MyRequest, res) => {
    const id = req.userId
    const surveys = await surveyDB.find(
      { creatorId: id },
      {}
      // { populate: 'questions' }
    )

    res.json(surveys)
  }
  getAll: RequestHandler = async (_req, res) => {
    try {
      const surveys = await surveyDB.find({}, {}, { populate: 'creator' })

      return res.json({
        surveys: surveys,
      })
    } catch (error) {
      console.error(error)
      return this.unknownError(res, {
        surveys: [],
        error: 'Internal Server Error.',
      })
    }
  }

  updateQuestion: RequestHandler<{ id: string; questionId: string }> = async (
    req,
    res
  ) => {
    try {
      // const surveyId = req.params.id
      const questionId = req.params.questionId
      const body = req.body as Partial<SurveyQuestionClient>

      const question = await SurveyQuestionDB.findById(questionId)
      if (!question) {
        return res.json({ error: 'Survey Not Found' })
      }
      await question
        .updateOne({
          $set: {
            ...body,
          },
        })
        .exec()
      return res.json(await SurveyQuestionDB.findById(questionId))
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  deleteQuestionFromSurvey: RequestHandler<{
    qid: string
  }> = async (req, res) => {
    const { qid } = req.params

    const question = await SurveyQuestionDB.findById(qid)

    if (!question) {
      return res.json({
        error: 'Question Not Found',
      })
    }
    const deleted = await question.remove()
    return res.json(deleted)
  }
  updateSurvey: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id as string
      const valuesToUpdate = req.body || {}

      const protectedProps = ['_id', 'creator', 'creatorId']
      for (const key of protectedProps) {
        deleteProp(valuesToUpdate, key)
      }

      if (valuesToUpdate.questions) {
        if (!utils.isSurveyQuestionInput(valuesToUpdate.questions)) {
          res.status(400).json({
            error: 'Invalid Questions input.',
          })
          return
        }
        function isInvalidID(_id: any): _id is string {
          return typeof _id === 'undefined' || _id === ''
        }
        if (Array.isArray(valuesToUpdate.questions)) {
          const nonExistingQuestions = (valuesToUpdate.questions as SurveyQuestionClient[]).filter(
            q => isInvalidID(q._id)
          )
          const ExistingQuestions = (valuesToUpdate.questions as SurveyQuestionClient[]).filter(
            q => !isInvalidID(q._id)
          )
          const raw_questions = SurveyQuestionGenerator.transformQuestions(
            nonExistingQuestions
          )

          const questions = await SurveyQuestionDB.create(raw_questions)
          if (questions) {
            for (const q of questions) {
              q.save()
            }
            valuesToUpdate.questions = [...ExistingQuestions, ...questions]
          } else {
            valuesToUpdate.questions = [...ExistingQuestions]
          }
        }
      }

      const updated = await surveyDB.updateOne(
        { _id: id },
        { $set: valuesToUpdate }
      )

      if (!updated.n) {
        res.status(404).json({
          error: 'Survey not found.',
        })
        return
      }
      res.json(await surveyDB.findById(id))
    } catch (error) {
      console.error(error)
      res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }
  createSurvey: RequestHandler<{}, SurveyCreateResponse> = async (
    req: MyRequest,
    res
  ) => {
    try {
      const data = req.body as ExpectedCreate
      const userId = req.userId!

      if (!data.open) {
        data.open = false
      }

      const [error, isValidData] = utils.validateCreate(data)
      if (!isValidData) {
        return res.status(400).json({
          error: error,
        })
      }

      const exists = await surveyDB.findOne({
        name: data.name,
      })

      if (exists) {
        return res.status(400).json({
          error: 'Survey with that name already exists.',
        })
      }

      const raw_questions = SurveyQuestionGenerator.transformQuestions(
        data.questions
      )

      const defaultValues = {
        open: false,
      }
      const questions = await SurveyQuestionDB.create(raw_questions)
      for (const q of questions) {
        q.save()
      }

      data.questions = questions

      let newSurvey: RawSurvey = {
        ...defaultValues,
        ...data,
        questions: questions,
        creatorId: userId,
      }

      const survey = await surveyDB.create({
        ...newSurvey,
        creatorId: userId,
        creator: userId as any,
      })
      await survey.save()
      return res.json(survey)
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  getOne: RequestHandler = async (req, res) => {
    const id = req.params.id as string
    const client = await this.validateClientKey(req)
    if (typeof client === 'string') {
      return res.status(404).json({
        error: client,
      })
    }

    const survey = await surveyDB.findOne(
      {
        _id: id,
        creator: client._id,
      },
      {},
      { populate: 'questions' }
    )
    if (!survey) {
      return res.status(404).json({
        error: 'Survey Not Found',
      })
    }
    return res.json(survey)
  }
  deleteOne: RequestHandler = async (req: MyRequest, res) => {
    const id = req.params.id as string

    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const survey = await surveyDB.findOne(
      {
        _id: id,
        creator: req.userId as any,
      },
      {}
    )

    if (!survey) {
      return res.status(404).json({
        error: 'Survey Not Found',
      })
    }

    const questions: string[] = (survey.questions as any) || []
    // const questions = survey.questions

    for (let q of questions) {
      await SurveyQuestionDB.deleteOne({
        _id: q,
      }).exec()
    }

    const deleted = await survey.remove()

    return res.json(deleted)
  }
  addSurveyResponse: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id as string
      const survey = await surveyDB.findById(id)
      if (!survey) {
        res.status(404).json({
          error: 'Survey Not Found',
        })
        return
      }
      const answers = req.body as SurveyResponseInput

      if (SurveyQuestionGenerator.isValidAnswerInput(answers) === false) {
        res.status(400).json({
          error: `Invalid request. Please send an array with {
          questionId: string
          answer: string[]
        }`,
          received: answers,
        })

        return
      }

      await SurveyQuestionGenerator.addAnswers(SurveyQuestionDB, answers)
      await survey.save()
      res.json(survey)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

const surveyRoutes = new SurveyRoutes()

export default surveyRoutes
