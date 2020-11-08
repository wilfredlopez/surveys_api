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
