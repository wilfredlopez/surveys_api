import { Survey } from '../interfaces'
import { Action } from './contextTypes'

export type SurveyActions =
  | Action<'setSurveys', Survey[]>
  | Action<'addSurvey', Survey>

export interface SurveyContextInterface {
  openSurveys: Survey[]
}
export interface SurveyState {
  surveys: SurveyContextInterface
}

const surveyReducer: React.Reducer<SurveyState, SurveyActions> = (
  state,
  action
) => {
  switch (action.type) {
    case 'setSurveys':
      state.surveys.openSurveys = action.payload
      return { ...state }
    case 'addSurvey':
      const exist = state.surveys.openSurveys.findIndex(
        s => s._id === action.payload._id
      )
      if (exist !== -1) {
        return { ...state }
      }

      state.surveys.openSurveys.push(action.payload)
      const newOpen = [...state.surveys.openSurveys]
      newOpen.push(action.payload)

      return { ...state, surveys: { ...state.surveys, openSurveys: newOpen } }
    default:
      //   assertNever(action)
      return state
  }
}

export default surveyReducer
