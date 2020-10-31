import { LOCALSTORAGE_TOKEN } from '../constants'
import { User } from '../interfaces'
import { Action } from './contextTypes'

export interface AuthContextState {
  user?: User
  errorMessage?: string
  loadingUser: boolean
}

export interface UserState {
  auth: AuthContextState
}

export type UserActions =
  | Action<'setUser', User>
  | Action<'logout'>
  | Action<'setLoadingUser', boolean>
  | Action<'setUserError', { error?: string }>

const userReducer: React.Reducer<UserState, UserActions> = (state, action) => {
  switch (action.type) {
    case 'setUser':
      state.auth.user = action.payload
      state.auth.errorMessage = undefined
      state.auth.loadingUser = false
      return { ...state }
    case 'logout':
      localStorage.removeItem(LOCALSTORAGE_TOKEN)
      state.auth.user = undefined
      state.auth.errorMessage = undefined
      return { ...state }
    case 'setUserError':
      state.auth.errorMessage = action.payload.error
      state.auth.loadingUser = false
      return { ...state }
    case 'setLoadingUser':
      state.auth.loadingUser = action.payload
      return { ...state }

    default:
      //   assertNever(action)
      return state
  }
}

export default userReducer
