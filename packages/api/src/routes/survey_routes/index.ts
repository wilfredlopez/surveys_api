import { RequestHandler, Request } from 'express'
import { getConnection } from 'typeorm'
import { SurveyQuestion } from '../../entities/SurveyQuestion'
import { RawSurvey } from '../../interfaces'
import { Survey } from '../../entities/Survey'
import { SurveyResponseInput } from '../../interfaces/index'
import {
  SurveyQuestionClient,
  SurveyQuestionGenerator,
} from '../../interfaces/index'
import { SharedUtils, ExpectedCreate } from 'shared'
import MyRequest from '../../interfaces/MyRequest'
import { User } from '../../entities/User'
import { UserHelper } from '../../interfaces/BaseUserGenerator'
import { BaseRoute } from '../BaseRoute'
import getSurveyWithQuestions from './getSurveyWithQuestions'
import { ObjectID } from 'mongodb'

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

    const client = await User.findOne({
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
      // const client = await userDb.findOne({
      //   publicKey: publicKey,
      // })

      const connection = getConnection()

      const surveyRepository = connection.getRepository(Survey)
      const surveys = await surveyRepository.find({
        where: {
          open: true,
          creatorId: client._id,
        },
        relations: ['questions'],
      })

      console.log({ surveys })

      const output: Survey[] = await getSurveyWithQuestions(surveys)

      return res.json({
        surveys: output,
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

    const surveys = await Survey.find({ creatorId: new ObjectID(id) })

    res.json(surveys)
  }
  getAll: RequestHandler = async (_req, res) => {
    try {
      const surveys = await Survey.find({ relations: ['creator'] })

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
      const body = req.body as Partial<
        Omit<SurveyQuestionClient, 'surveyId' | '_id'>
      >

      const question = await SurveyQuestion.findOne(questionId)
      if (!question) {
        return res.json({ error: 'Survey Not Found' })
      }
      const connection = await getConnection()

      connection
        .createQueryBuilder()
        .update(SurveyQuestion)
        .set({
          ...body,
        })
        .where('_id = :_id', { _id: questionId })
        .execute()

      return res.json(await SurveyQuestion.findOne(questionId))
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

    const question = await SurveyQuestion.findOne(qid)

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
        if (!SharedUtils.isSurveyQuestionInput(valuesToUpdate.questions)) {
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

          const survey = await Survey.findOne(id)
          if (!survey) {
            res.json({
              error: 'Survey Not Found',
            })
            return
          }
          const raw_questions = SurveyQuestionGenerator.transformQuestions(
            nonExistingQuestions,
            survey._id
          )

          const questions = await SurveyQuestion.create(raw_questions)
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

      const connection = await getConnection()
      const updated = await connection
        .createQueryBuilder()
        .update(Survey)
        .set(valuesToUpdate)
        .where('_id = :_id', { _id: id })
        .execute()

      if (!updated.affected) {
        res.status(404).json({
          error: 'Survey not found.',
        })
        return
      }
      res.json(await Survey.findOne(id))
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

      const [error, isValidData] = SharedUtils.validateCreate(data)
      if (!isValidData) {
        return res.status(400).json({
          error: error,
        })
      }

      const exists = await Survey.findOne({
        name: data.name,
      })

      if (exists) {
        return res.status(400).json({
          error: 'Survey with that name already exists.',
        })
      }

      const defaultValues = {
        open: false,
      }

      let newSurvey: Omit<RawSurvey, '_id'> = {
        ...defaultValues,
        ...data,
        creatorId: new ObjectID(userId),
        questions: [],
      }

      const survey = Survey.create({
        ...newSurvey,
      })

      await survey.save()

      if (!data.questions) {
        data.questions = []
      }
      const raw_questions = SurveyQuestionGenerator.transformQuestions(
        data.questions,
        survey._id
      )

      const questions: SurveyQuestion[] = []

      for (let rq of raw_questions) {
        const q = SurveyQuestion.create(rq)

        await q.save()
        questions.push(q)
      }

      survey.questions = questions

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

    const survey = await Survey.findOne({
      where: {
        _id: new ObjectID(id),
        creatorId: client._id,
      },
    })

    if (!survey) {
      return res.status(404).json({
        error: 'Survey Not Found',
      })
    }
    const surveyWithQuestions = await getSurveyWithQuestions([survey])
    return res.json(surveyWithQuestions[0])
  }
  deleteOne: RequestHandler = async (req: MyRequest, res) => {
    const id = req.params.id as string

    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const the_survey = await Survey.findOne(id)

    if (!the_survey) {
      return res.status(404).json({
        error: 'Survey Not Found',
      })
    }

    const surveys = await getSurveyWithQuestions([the_survey])
    const questions = surveys[0].questions.map(s => s._id)

    // const questions = survey.questions

    for (let q of questions) {
      await SurveyQuestion.delete({
        _id: new ObjectID(q),
      })
    }

    const deleted = await the_survey.remove()

    return res.json(deleted)
  }
  addSurveyResponse: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id as string
      const survey = await Survey.findOne(id)
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

      await SurveyQuestionGenerator.addAnswers(answers)

      res.json(survey)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

const surveyRoutes = new SurveyRoutes()

export default surveyRoutes
