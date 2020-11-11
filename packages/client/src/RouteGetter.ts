// import { generatePath } from 'react-router'
import { RouteGetterGenerator, RouterGetterRecord } from 'react-use-light'

type RouteKeys =
  | 'home'
  | 'answers'
  | 'login'
  | 'register'
  | 'account'
  | 'create-survey'
  | 'my-surveys'
  | 'update-survey'
  | 'display-surveys'
  | 'display-surveys-state'
  | 'one-survey'
  | 'one-survey-state'
  | 'thanks'

const routes: RouterGetterRecord<RouteKeys> = {
  home: {
    value: '/',
  },
  answers: {
    value: '/anwers/:id',
    params: {
      id: '',
    },
  },
  login: {
    value: '/login',
  },
  register: {
    value: '/register',
  },
  account: {
    value: '/account',
  },
  'create-survey': {
    value: '/create-survey',
  },
  'my-surveys': {
    value: '/account/my-surveys',
  },
  'update-survey': {
    value: '/surveys/update/:id',
    params: {
      id: '',
    },
  },
  'display-surveys': {
    value: '/surveys-redirect/:publicKey',
    params: {
      publicKey: '/',
    },
  },
  'display-surveys-state': {
    value: '/surveys/',
  },
  'one-survey': {
    value: '/survey/:id/:publicKey',
    params: {
      publicKey: '/',
      id: '/',
    },
  },
  'one-survey-state': {
    value: '/survey',
  },
  thanks: {
    value: '/thankyou',
  },
}

export const RouteGetter = new RouteGetterGenerator<
  RouteKeys,
  RouterGetterRecord<RouteKeys>
>(routes)

export default RouteGetter
