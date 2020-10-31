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
interface AppRoutes extends RouterGetterRecord<RouteKeys> {
  home: {
    value: string
  }
  answers: {
    value: string
    params: {
      id: string
    }
  }
  login: {
    value: string
  }
  register: {
    value: string
  }
  account: {
    value: string
  }
  'create-survey': {
    value: string
  }
  'my-surveys': {
    value: string
  }
  'update-survey': {
    value: string
    params: {
      id: string
    }
  }
}

export const RouteGetter = new RouteGetterGenerator<RouteKeys, AppRoutes>({
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
})

export default RouteGetter
