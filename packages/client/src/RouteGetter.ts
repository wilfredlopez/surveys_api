// import { generatePath } from 'react-router'
import { RouteGetterGenerator, RouterGetterRecord } from 'react-use-light'

type RouteKeys =
  | 'home'
  | 'answers'
  | 'login'
  | 'register'
  | 'account'
  | 'create-survey'
  | 'edit-surveys'
  | 'update-survey'
  | 'display-surveys'
  | 'display-surveys-state'
  | 'one-survey'
  | 'one-survey-state'
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
  'display-surveys': {
    value: string
    params: {
      publicKey: string
    }
  }
  'create-survey': {
    value: string
  }
  'edit-surveys': {
    value: string
  }
  'update-survey': {
    value: string
    params: {
      id: string
    }
  }
  'display-surveys-state': {
    value: string
  }
  'one-survey': {
    value: string
    params: {
      publicKey: string
      id: string
    }
  }
  'one-survey-state': {
    value: string
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
  'edit-surveys': {
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
})

export default RouteGetter
