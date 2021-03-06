import React, { lazy } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { DisplaySurveysPage } from './pages/DisplaySurveysPage'
import LazySuspense from './LazySuspence'
import RouteGetter from './RouteGetter'
// import AppMenu from './components/AppMenu'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import NotFoundPage from './pages/NotFoundPage'
// import SurveyAnswers from './pages/SurveyAnswers'
// import CreateSurvey from './pages/CreateSurvey'
// import MySurveys from './pages/MySurveys'
// import UpdateSurveyPage from './pages/UpdateSurveyPage'
import HomePage from './pages/HomePage'
import DisplaySurveysState from './pages/DisplaySurveyState'
import { OneSurvey, OneSurveyState } from './pages/OneSurvey'
import WithHeader from './components/WithHeader'
import ThankYouPage from './pages/ThankYouPage'
const MySurveys = LazySuspense(lazy(() => import('./pages/MySurveys')))
const CreateSurvey = LazySuspense(lazy(() => import('./pages/CreateSurvey')))
const SurveyAnswers = LazySuspense(lazy(() => import('./pages/SurveyAnswers')))
const UpdateSurveyPage = LazySuspense(lazy(() => import('./pages/UpdateSurveyPage')))

interface Props {

}

export const AppRoutes = (props: Props) => {
    return (
        <BrowserRouter>
            {/* <AppMenu /> */}
            <Switch>

                <Route path={RouteGetter.path('home')} component={WithHeader(HomePage)} exact />
                <Route path={RouteGetter.path('display-surveys')} component={DisplaySurveysPage} exact />
                <Route path={RouteGetter.path('display-surveys-state')} component={DisplaySurveysState} exact />
                <Route path={RouteGetter.path('one-survey')} component={OneSurvey} exact />
                <Route path={RouteGetter.path('one-survey-state')} component={OneSurveyState} exact />
                <Route path={RouteGetter.path('answers')} component={WithHeader(SurveyAnswers)} />
                <Route path={RouteGetter.path('login')} component={WithHeader(Login)} />
                <Route path={RouteGetter.path('register')} component={WithHeader(Register)} />
                <Route path={RouteGetter.path('account')} component={WithHeader(Account)} exact />
                <Route path={RouteGetter.path('create-survey')} component={WithHeader(CreateSurvey)} />
                <Route path={RouteGetter.path('my-surveys')} component={WithHeader(MySurveys)} />
                <Route path={RouteGetter.path('update-survey')} component={WithHeader(UpdateSurveyPage)} />
                <Route path={RouteGetter.path('thanks')} component={ThankYouPage} />
                <Route path={'*'} component={WithHeader(NotFoundPage)} />
            </Switch>
        </BrowserRouter>
    )
}
