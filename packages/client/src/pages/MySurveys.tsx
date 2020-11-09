import React from 'react'
import { Container, Box, Typography, Button, ButtonGroup, List } from '@material-ui/core'
import fetchUtils from '../fetchUtils/index'
import { SurveyUnpolulated } from 'shared'
import { useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import useProtectedRoute from '../hooks/useProtectedRoute'
import UnstyledLink from '../components/shared/UnstyledLink'
import { useBoolean, useEffectOnce } from 'react-use-light'
import { UserClient } from '../../../shared/dist/interfaces/userInterfaces'
import ButtonFlex from '../styles/ButtonFlex'

interface Props {

}

const MySurveys = (props: Props) => {
    const [surveys, setSurveys] = React.useState<SurveyUnpolulated[]>([])
    const history = useHistory()
    const user = useProtectedRoute()
    useEffectOnce(() => {
        fetchUtils.getMySurveys().then((data) => {
            if ('error' in data) {
                fetchUtils.handleUnauthorized(data, history)
                return
            }
            setSurveys(data)
        }).catch(e => console.error(e))
    })
    return (
        <Container>
            <h1>My Surveys</h1>
            {surveys.length === 0 && <div>
                <p>No Surveys Yet. <UnstyledLink to={RouteGetter.path('create-survey')} color="blue">Create a new one</UnstyledLink></p>
            </div>}
            <List>

                {surveys.map((sur, index) => {
                    return <li key={sur._id}><UserSurvey user={user} survey={sur} index={index} /></li>
                })}
            </List>

        </Container>
    )
}

const UserSurvey = ({ survey, user }: { survey: SurveyUnpolulated, index: number, user: UserClient }) => {
    const history = useHistory()
    const [open, setOpen] = useBoolean(survey.open)
    const [show, setShow] = useBoolean(true)
    function toogleOpen() {

        fetchUtils.updatedSurvey(survey._id, {
            open: !open
        }).then(updated => {
            fetchUtils.handleUnauthorized(updated as any, history)
            setOpen(updated.open)
        }).catch(e => {
            console.log(e)
            if (e instanceof Error) {
                fetchUtils.handleUnauthorized({ error: e.message }, history)
            }
        })
    }

    function handleDelete() {
        console.log('deleting', survey._id)
        fetchUtils.deleteSurvey(survey._id)
            .then(res => {
                console.log(res)
                setShow(false)
            }).catch(e => {
                console.log(e)

            })


    }

    function getLink() {
        return RouteGetter.path('one-survey', { id: survey._id, publicKey: user.publicKey })
    }

    function copyLink() {
        const root = window.location.host
        const prot = window.location.protocol
        const link = getLink()

        navigator.clipboard.writeText(`${prot}/${root}${link}`)
    }

    if (!show) {
        return null
    }

    return <Box mb={3}>
        <Box display="flex" alignItems="center">

            <Typography>

                <UnstyledLink to={getLink()} color="blue">

                    <b> {survey.name} </b>(open: {open ? 'Yes' : "No"})
            </UnstyledLink>
            </Typography>
            <Box ml={2}>
                <Box display="flex" padding="0 8px">
                    <ButtonGroup>

                        <Button size="small" variant="outlined" onClick={toogleOpen}>Toggle Open</Button>
                        <Button onClick={copyLink}>Copy Link</Button>
                        <Button size="small" variant="outlined" color='secondary' onClick={() => {
                            history.push(RouteGetter.path('update-survey', { id: survey._id }))
                        }}>Edit</Button>
                        <ButtonFlex color="outlined-error" size="small" variant="outlined" onClick={handleDelete}>DELETE</ButtonFlex>
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    </Box>
}

export default MySurveys
