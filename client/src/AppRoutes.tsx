import React, { lazy } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import LazySuspense from './LazySuspence'
import RouteGetter from './RouteGetter'
import AppMenu from './components/AppMenu'
import Login from './pages/Login'
import Register from './pages/Register'
import { Account } from './pages/Account'
import NotFoundPage from './pages/NotFoundPage'
// import SurveyAnswers from './pages/SurveyAnswers'
// import CreateSurvey from './pages/CreateSurvey'
// import MySurveys from './pages/MySurveys'
// import UpdateSurveyPage from './pages/UpdateSurveyPage'
const MySurveys = LazySuspense(lazy(() => import('./pages/MySurveys')))
const CreateSurvey = LazySuspense(lazy(() => import('./pages/CreateSurvey')))
const SurveyAnswers = LazySuspense(lazy(() => import('./pages/SurveyAnswers')))
const UpdateSurveyPage = LazySuspense(lazy(() => import('./pages/UpdateSurveyPage')))

interface Props {

}

export const AppRoutes = (props: Props) => {
    return (
        <BrowserRouter>
            <AppMenu />
            <Switch>

                <Route path={RouteGetter.path('home')} component={HomePage} exact />
                <Route path={RouteGetter.path('answers')} component={SurveyAnswers} />
                <Route path={RouteGetter.path('login')} component={Login} />
                <Route path={RouteGetter.path('register')} component={Register} />
                <Route path={RouteGetter.path('account')} component={Account} exact />
                <Route path={RouteGetter.path('create-survey')} component={CreateSurvey} />
                <Route path={RouteGetter.path('my-surveys')} component={MySurveys} />
                <Route path={RouteGetter.path('update-survey')} component={UpdateSurveyPage} />
                <Route path={'*'} component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    )
}
