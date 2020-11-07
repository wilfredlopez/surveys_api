import { Router } from 'express'
import surveyRoutes from './survey_routes'
import authRoutes from './auth_routes/index'
import { authMiddleware } from '../middleware/authMiddleware'
import { ensureAuthenticated } from '../middleware/ensureAuth'
import { ensureAdmin } from '../middleware/ensureAdmin'
import orderRoutes from './orders/index'

const routes = Router()

routes.use(authMiddleware)

/**
 * AUTH
 */
routes.post('/login', authRoutes.login.bind(authRoutes))
routes.post('/register', authRoutes.register.bind(authRoutes))
routes.get('/me', authRoutes.me.bind(authRoutes))
routes.get('/users/all', ensureAdmin, authRoutes.allUsers.bind(authRoutes))
routes.delete(
  '/users/:id',
  ensureAuthenticated,
  authRoutes.removeUser.bind(authRoutes)
)

routes.post(
  '/users/admin/:id',
  ensureAuthenticated,
  authRoutes.makeUserAdmin.bind(authRoutes)
)

/**
 * SURVEYS
 */
//GET ROUTES
routes.get(
  '/mysurveys',
  ensureAuthenticated,
  surveyRoutes.mySurveys.bind(surveyRoutes)
)
routes.get('/surveys', surveyRoutes.getOpen.bind(surveyRoutes))
routes.get('/all/surveys', ensureAdmin, surveyRoutes.getAll.bind(surveyRoutes))

routes.get('/surveys/:id', surveyRoutes.getOne.bind(surveyRoutes))
routes.delete(
  '/surveys/:id',
  ensureAuthenticated,
  surveyRoutes.deleteOne.bind(surveyRoutes)
)
//create new survey
routes.post(
  '/surveys',
  ensureAuthenticated,
  surveyRoutes.createSurvey.bind(surveyRoutes)
)
//update survey data
routes.post(
  '/surveys/:id',
  ensureAuthenticated,
  surveyRoutes.updateSurvey.bind(surveyRoutes)
)
//updated survey question
routes.post(
  '/surveys/:id/question/:questionId',
  ensureAuthenticated,
  surveyRoutes.updateQuestion.bind(surveyRoutes)
)
//fill a survey response
routes.post(
  '/surveys/answer/:id',
  surveyRoutes.addSurveyResponse.bind(surveyRoutes)
)

// DELETE QUESTION FROM SURVEY
routes.delete(
  '/questions/:qid',
  ensureAuthenticated,
  surveyRoutes.deleteQuestionFromSurvey.bind(surveyRoutes)
)

//ORDERS

routes.post(
  '/orders',
  ensureAuthenticated,
  orderRoutes.placeOrder.bind(orderRoutes)
)

export default routes
