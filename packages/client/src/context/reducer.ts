// import { assertNever } from '@wilfredlopez/react-utils'
// import { LOCALSTORAGE_TOKEN } from '../constants'
// import { Survey, User } from '../interfaces'
// import fetchUtils from '../fetchUtils'

// export type Action<T extends string, P = undefined> = P extends undefined
//   ? {
//       type: T
//     }
//   : {
//       type: T
//       payload: P
//     }

// export interface AuthContextState {
//   user?: User
//   errorMessage?: string
//   loadingUser: boolean
// }

// export interface SurveyContextInterface {
//   openSurveys: Survey[]
// }

// export const actionCreators = {
//   addSurveyAnswers: fetchUtils.addSurveyAnswers,
//   fetchOneSurvey: fetchUtils.fetchOneSurvey,
// }

// export interface AppContextState {
//   auth: AuthContextState
//   surveys: SurveyContextInterface
//   dispatch: React.Dispatch<AppActions>
//   actionCreators: typeof actionCreators
// }

// export type AppActions =
//   | Action<'setUser', User>
//   | Action<'logout'>
//   | Action<'setSurveys', Survey[]>
//   | Action<'addSurvey', Survey>
//   | Action<'setLoadingUser', boolean>
//   | Action<'setUserError', { error?: string }>

// export const reducer: React.Reducer<AppContextState, AppActions> = (
//   state,
//   action
// ) => {
//   switch (action.type) {
//     case 'setUser':
//       state.auth.user = action.payload
//       state.auth.errorMessage = undefined
//       state.auth.loadingUser = false
//       return { ...state }
//     case 'logout':
//       localStorage.removeItem(LOCALSTORAGE_TOKEN)
//       state.auth.user = undefined
//       state.auth.errorMessage = undefined
//       return { ...state }
//     case 'setSurveys':
//       state.surveys.openSurveys = action.payload
//       return { ...state }
//     case 'addSurvey':
//       const exist = state.surveys.openSurveys.findIndex(
//         s => s._id === action.payload._id
//       )
//       if (exist !== -1) {
//         return { ...state }
//       }

//       state.surveys.openSurveys.push(action.payload)
//       const newOpen = [...state.surveys.openSurveys]
//       newOpen.push(action.payload)

//       return { ...state, surveys: { ...state.surveys, openSurveys: newOpen } }
//     case 'setUserError':
//       state.auth.errorMessage = action.payload.error
//       state.auth.loadingUser = false
//       return { ...state }
//     case 'setLoadingUser':
//       state.auth.loadingUser = action.payload
//       return { ...state }

//     default:
//       assertNever(action)
//       return state
//   }
// }

// export default reducer

/******************************* */
// import combineReducers from './CombineReducer'
import { combineReducers } from 'react-use-light'
import fetchUtils from '../fetchUtils'
import surveyReducer, { SurveyActions, SurveyState } from './surveyReducer'
import userReducer, { UserActions, UserState } from './userReducer'

export const actionCreators = {
  addSurveyAnswers: fetchUtils.addSurveyAnswers,
  fetchOneSurvey: fetchUtils.fetchOneSurvey,
}

export interface GlobalState {
  dispatch: React.Dispatch<AppActions>
  actionCreators: typeof actionCreators
}

export type AppContextState = SurveyState & UserState & GlobalState
export type AppActions = SurveyActions | UserActions

export const reducer = combineReducers<AppContextState, AppActions>(
  userReducer,
  surveyReducer
)

export default reducer
