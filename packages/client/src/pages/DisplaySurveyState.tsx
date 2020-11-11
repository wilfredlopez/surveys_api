import { Box, Card, CardContent, Container, Typography, CardHeader } from '@material-ui/core'
import React from 'react'
import { SurveySkeleton } from '../components/skeletons/SurveySkeleton'
import SurveyComponent from '../components/SurveyComponent'
import { useAppContext } from '../context/AppContext'
import { useAsync } from 'react-use-light'
import { useLocation } from 'react-router-dom'
import LinkButton from '../components/shared/LinkButton'
import RouteGetter from '../RouteGetter'
import ButtonFlex from '../styles/ButtonFlex'
import UnstyledLink from '../components/shared/UnstyledLink'

interface Props {

}

function isStateUndefined(history: any) {
    if (typeof history.state === 'undefined' || typeof history.state.publicKey === 'undefined') {
        return true
    }
    return false
}

const DisplaySurveysState = (_: Props) => {
    const { openSurveys, dispatch, fetchSurveys, user } = useAppContext()
    const history = useLocation<{ publicKey: string }>()

    const { publicKey } = history?.state || {}
    const { loading, error } = useAsync(async () => {
        if (isStateUndefined(history)) {
            return
        }
        const surveys = await fetchSurveys({ publicKey: history.state.publicKey })

        if (surveys) {
            dispatch({
                type: 'setSurveys',
                payload: surveys
            })
        }

        return surveys

    })

    if (isStateUndefined(history)) {

        return <Container>
            <br />
            <Card>
                <CardContent>
                    <CardHeader
                        title={<Typography variant="h4" component="h1" align="center">Public Key Restriction</Typography>
                        }
                        action={<LinkButton color="textInfo" to={RouteGetter.path('home')}>Back Home</LinkButton>}
                    />
                    <Typography gutterBottom>
                        Please verify that your link is authorized.
                    </Typography>
                    <Typography>
                        Are you registered?
                        <br />
                        <UnstyledLink color="blue" to={RouteGetter.path('login')}>Login</UnstyledLink>
                    </Typography>
                </CardContent>
            </Card>
            <br />

        </Container>
    }




    function refetch() {
        fetchSurveys({ refetch: true, publicKey }).then((surveys) => {
            dispatch({
                type: 'setSurveys',
                payload: surveys
            })
        }).catch((e) => {
            console.log(e)
        })
    }




    return (
        <Container>
            <Box mt={4} mx={2} textAlign="right">
                {user &&

                    <ButtonFlex onClick={refetch} color="outlinedInfo" size="small">Refetch</ButtonFlex>

                }
            </Box>
            {(!openSurveys || openSurveys.length === 0) && error && <div><p style={{ color: 'red' }}>{error.message}</p></div>}
            {loading && <SurveySkeleton />}
            {!loading && openSurveys.length === 0 && <div>
                <p>No Surveys Found.</p>
            </div>}
            {openSurveys.map((s, index) => {
                return <SurveyComponent number={index + 1} survey={s} key={'survey' + s.id} />
            })}
            <br />
            <br />
            <br />
        </Container>
    )
}


export default DisplaySurveysState