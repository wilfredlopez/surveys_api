import { RequestHandler, Request } from 'express'
import SurveyQuestion from '../../db/SurveyQuestion'
import { RawSurvey, SurveyResponseInput, SurveyQuestionClient } from 'shared'
import Survey from '../../db/Survey'
import { SurveyQuestionHelper } from '../../helpers'
import { SharedUtils, ExpectedCreate, UserModel, SurveyModel } from 'shared'
import MyRequest from '../../interfaces'
import User from '../../db/User'
import { UserHelper } from '../../helpers/UserHelper'
import { BaseRoute } from '../BaseRoute'

function deleteProp<T extends {} = any>(obj: T, key: keyof T) {
  if (obj[key]) {
    delete obj[key]
  }
}

export type SurveyCreateResponse = SurveyModel | { error: string }

class SurveyRoutes extends BaseRoute {
  async validateClientKey(req: Request): Promise<string | UserModel> {
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

      const surveys = await Survey.find(
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
    const surveys = await Survey.find(
      { creatorId: id },
      {}
      // { populate: 'questions' }
    )

    res.json(surveys)
  }
  getAll: RequestHandler = async (_req, res) => {
    try {
      const surveys = await Survey.find({}, {}, { populate: 'creator' })

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

  updateQuestion: RequestHandler<any> = async (
    req: MyRequest<{ id: string; questionId: string }>,
    res
  ) => {
    try {
      // const surveyId = req.params.id
      const questionId = req.params.questionId
      const body = req.body as Partial<SurveyQuestionClient>

      const question = await req.dataloaders!.loaders.surveyQuestionLoader.load(
        questionId
      )

      // const question = await SurveyQuestion.findById(questionId)
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

      // return res.json(await SurveyQuestion.findById(questionId))
      return res.json(
        await req.dataloaders!.loaders.surveyQuestionLoader.load(questionId)
      )
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  deleteQuestionFromSurvey: RequestHandler<{
    qid: string
  }> = async (req: MyRequest<{ qid: string }>, res) => {
    const { qid } = req.params
    const question = await req.dataloaders!.loaders.surveyQuestionLoader.load(
      qid
    )
    // const question = await SurveyQuestion.findById(qid)

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
          const raw_questions = SurveyQuestionHelper.transformQuestions(
            nonExistingQuestions
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

      const updated = await Survey.updateOne(
        { _id: id },
        { $set: valuesToUpdate }
      )

      if (!updated.n) {
        res.status(404).json({
          error: 'Survey not found.',
        })
        return
      }
      res.json(await Survey.findById(id))
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

      const raw_questions = SurveyQuestionHelper.transformQuestions(
        data.questions
      )

      const defaultValues = {
        open: false,
      }
      const questions = await SurveyQuestion.create(raw_questions)
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

      const survey = await Survey.create({
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

    const survey = await Survey.findOne(
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

    const survey = await Survey.findOne(
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
      await SurveyQuestion.deleteOne({
        _id: q,
      }).exec()
    }

    const deleted = await survey.remove()

    return res.json(deleted)
  }
  addSurveyResponse: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id as string
      const survey = await Survey.findById(id)
      if (!survey) {
        res.status(404).json({
          error: 'Survey Not Found',
        })
        return
      }
      const answers = req.body as SurveyResponseInput

      if (SurveyQuestionHelper.isValidAnswerInput(answers) === false) {
        res.status(400).json({
          error: `Invalid request. Please send an array with {
          questionId: string
          answer: string[]
        }`,
          received: answers,
        })

        return
      }

      await SurveyQuestionHelper.addAnswers(answers)
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
