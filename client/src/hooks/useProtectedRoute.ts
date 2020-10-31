// import { useAuthContext } from '../context/AuthContext'
import { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import { User } from '../interfaces'
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
    const fakeUser: User = {
      _id: '',
      avatar: '',
      email: '',
      firstname: '',
      lastname: '',
      password: '',
    }
    return fakeUser
  }
  return user as User
}

export default useProtectedRoute
