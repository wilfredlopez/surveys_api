import React from 'react'
import { useParams, Redirect, useLocation } from 'react-router-dom'
import { useAsync } from 'react-use-light'
import LinkButton from '../components/shared/LinkButton'
import { SurveySkeleton } from '../components/skeletons/SurveySkeleton'
import SurveyComponent from '../components/SurveyComponent'
import { useAppContext } from '../context/AppContext'
import RouteGetter from '../RouteGetter'
import { Container, Card, CardContent, CardHeader, Typography, Box } from '@material-ui/core'
import { SurveyClient } from '../../../shared/dist/interfaces/surveyInterfaces'

interface Props {

}

function isStateUndefined(history: any) {
    if (typeof history.state === 'undefined' || typeof history.state.publicKey === 'undefined') {
        return true
    }
    return false
}


export const OneSurvey = (props: Props) => {
    const { publicKey, id } = useParams<{ publicKey: string, id: string }>()


    return <Redirect to={
        {
            pathname: RouteGetter.path('one-survey-state'),
            state: {
                publicKey,
                id
            }
        }
    } />

}

export const OneSurveyState = (props: Props) => {
    const { getSurvey } = useAppContext()
    const history = useLocation<{ publicKey: string, id: string }>()

    const [survey, setSurvey] = React.useState<SurveyClient>()

    const { publicKey, id } = history?.state || {}
    const { loading, error } = useAsync(async () => {
        if (isStateUndefined(history)) {
            return
        }
        const res = await getSurvey({ id: id, publicKey: publicKey })



        if (res) {
            setSurvey(res)
        }

        return res

    })

    if (isStateUndefined(history)) {

        return <Container>
            <br />
            <Card>
                <CardContent>
                    <CardHeader
                        title={<Typography variant="h4" component="h1" align="center">Please verify your link.</Typography>}
                        action={<LinkButton color="text-info" to={RouteGetter.path('home')}>Back Home</LinkButton>}
                    />
                </CardContent>
            </Card>
            <br />

        </Container>
    }

    if (!survey) {
        return <SurveySkeleton />
    }


    return (
        <Container>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <h1>Survey</h1>
            </Box>
            {error && <div><p style={{ color: 'red' }}>{error.message}</p></div>}
            {loading && <SurveySkeleton />}
            {!loading && (!survey) && <div>
                <p>Survey Not Found.</p>
            </div>}
            <SurveyComponent number={1} survey={survey} key={'survey' + survey._id} />
            <br />
            <br />
            <br />
        </Container>
    )
}

