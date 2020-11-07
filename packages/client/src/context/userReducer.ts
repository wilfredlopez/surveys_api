import { LOCALSTORAGE_TOKEN } from '../constants'
import { UserClient } from 'shared'
import { Action } from './contextTypes'

export interface AuthContextState {
  user?: UserClient
  userErrorMessage?: string
  loadingUser: boolean
}

export interface UserState {
  auth: AuthContextState
}

export type UserActions =
  | Action<'setUser', UserClient>
  | Action<'logout'>
  | Action<'setLoadingUser', boolean>
  | Action<'setUserError', { error?: string }>

const userReducer: React.Reducer<UserState, UserActions> = (state, action) => {
  switch (action.type) {
    case 'setUser':
      state.auth.user = action.payload
      state.auth.userErrorMessage = undefined
      state.auth.loadingUser = false
      return { ...state }
    case 'logout':
      localStorage.removeItem(LOCALSTORAGE_TOKEN)
      state.auth.user = undefined
      state.auth.userErrorMessage = undefined
      return { ...state }
    case 'setUserError':
      state.auth.userErrorMessage = action.payload.error
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
