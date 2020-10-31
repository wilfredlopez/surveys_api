import React from 'react'
import { Button, Card, CardActions, CardHeader, Container } from '@material-ui/core'
import RouteGetter from '../RouteGetter'
import useProtectedRoute from '../hooks/useProtectedRoute'
import LinkButton from '../components/shared/LinkButton'
import { useAppContext } from '../context/AppContext'

interface Props {

}

export const Account = (props: Props) => {
    const { dispatch } = useAppContext()
    const user = useProtectedRoute()
    return (
        <Container>
            <h1>Account</h1>
            <Card>
                <CardHeader
                    title={`${user.firstname} ${user.lastname}`}
                    avatar={<img src={user.avatar} alt={user.firstname} />}
                    subheader={user.email}
                >

                    <p>{user.firstname} {user.lastname}</p>
                </CardHeader>
                <CardActions>
                    <LinkButton to={RouteGetter.path('create-survey')} variant="outlined" size="small" color="primary">Create Survey</LinkButton>
                    <LinkButton to={RouteGetter.path('my-surveys')} variant="outlined" size="small" color="primary">My Surveys</LinkButton>
                    <Button onClick={() => dispatch({ type: 'logout' })} variant="outlined" size="small" color="secondary">Logout</Button>

                </CardActions>
            </Card>

        </Container>
    )
}


export default Account