import { RequestHandler } from 'express'
import SurveyQuestionDB from '../../db/SurveyQuestionDB'
import { RawSurvey } from '../../interfaces'
import surveyDB from '../../db/surveysDB'
import { SurveyResponseInput } from '../../interfaces/index'
import {
  SurveyQuestionClient,
  isValidQuestionType,
  SurveyQuestionGenerator,
} from '../../interfaces/index'
import MyRequest from '../../interfaces/MyRequest'
import { Survey } from '../../interfaces/'

const isString = (id?: string) => typeof id === 'string' && id.trim() !== ''
function isSurveyQuestionInput(quests?: SurveyQuestionClient[]) {
  if (!Array.isArray(quests)) {
    return false
  }
  if (quests.length === 0) {
    return false
  }
  for (let q of quests) {
    if (!isValidQuestionType(q.type)) {
      return false
    }
    if (!isString(q.title)) {
      return false
    }
    if (!Array.isArray(q.options)) {
      return false
    }
  }

  return true
}

function deleteProp<T extends {} = any>(obj: T, key: keyof T) {
  if (obj[key]) {
    delete obj[key]
  }
}

export type ExpectedCreate = Pick<RawSurvey, 'name' | 'questions' | 'open'>

export type SurveyCreateResponse = Survey | { error: string }

class SurveyRoutes {
  getOpen: RequestHandler = async (_req, res) => {
    try {
      const surveys = await surveyDB.find(
        { open: true },
        {},
        { populate: 'questions' }
      )

      return res.json({
        surveys,
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
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

      res.json({
        surveys: surveys,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
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
  updateSurvey: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id as string
      const valuesToUpdate = req.body || {}

      const protectedProps = ['_id', 'creator', 'creatorId']
      for (const key of protectedProps) {
        deleteProp(valuesToUpdate, key)
      }

      if (valuesToUpdate.questions) {
        if (!isSurveyQuestionInput(valuesToUpdate.questions)) {
          res.status(400).json({
            error: 'Invalid Questions input.',
          })
          return
        }
        if (Array.isArray(valuesToUpdate.questions)) {
          const nonExistingQuestions = (valuesToUpdate.questions as SurveyQuestionClient[]).filter(
            q => q._id === ''
          )
          const ExistingQuestions = (valuesToUpdate.questions as SurveyQuestionClient[]).filter(
            q => q._id !== ''
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

      const isValidData = this.validateCreate(data)
      if (!isValidData) {
        return res.status(400).json({
          error: 'missing fields.',
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
        creatorId: userId,
      }

      const survey = await surveyDB.create({
        ...newSurvey,
        creatorId: userId,
        //@ts-ignore
        creator: userId,
      })
      await survey.save()
      return res.json(survey)
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  private validateCreate(data: ExpectedCreate) {
    const expected: { [K in keyof ExpectedCreate]: (data: any) => boolean } = {
      name: isString,
      questions: isSurveyQuestionInput,
      open: () => true,
    }
    let val: any
    let fn: (v: any) => boolean
    for (let key in expected) {
      val = data[key as keyof ExpectedCreate]
      fn = expected[key as keyof typeof expected]
      if (typeof val === 'undefined') {
        console.log('val is undefined')
        return false
      }
      if (!fn(val)) {
        return false
      }
    }
    return true
  }
  getOne: RequestHandler = async (req, res) => {
    const id = req.params.id as string
    const survey = await surveyDB.findById(id, {}, { populate: 'questions' })
    if (!survey) {
      res.status(404).json({
        error: 'Survey Not Found',
      })
      return
    }
    res.json(survey)
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
          answer: string
        }`,
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
