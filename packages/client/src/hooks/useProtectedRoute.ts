// import { useAuthContext } from '../context/AuthContext'
import { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import { UserClient } from 'shared'
import { useAppContext } from '../context/AppContext'

const useProtectedRoute = (redirectTo?: string) => {
  //   const { user } = useAuthContext()
  const { user, loadingUser } = useAppContext()
  const history = useHistory()
  useLayoutEffect(() => {
    if (!user && !loadingUser) {
      if (redirectTo) {
        history.replace(redirectTo)
      } else {
        history.replace(RouteGetter.path('login'))
      }
    }
    //eslint-disable-next-line
  }, [user, loadingUser])
  if (!user) {
    const fakeUser: UserClient = {
      _id: '',
      avatar: '',
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      privateKey: '',
      publicKey: '/',
      plan: 'trial',
      isAdmin: false,
    }
    return fakeUser
  }
  return user as UserClient
}

export default useProtectedRoute
