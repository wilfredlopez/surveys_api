import React from 'react'
import { Card, CardActions, CardContent, Container, Typography } from '@material-ui/core'
import RouteGetter from '../RouteGetter'
import LinkButton from '../components/shared/LinkButton'
import { makeStyles } from '@material-ui/core/styles'

interface Props {

}

const useStyles = makeStyles({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        margin: 'auto',
        height: '70vh',
    }
})

const NotFoundPage = (props: Props) => {
    const classes = useStyles()
    return (
        <Container className={classes.root}>
            <Card >
                <CardContent>
                    <Typography variant="h4" component="h1">404: Page Not Found</Typography>

                </CardContent>
                <CardActions>

                    <LinkButton color="textPrimary" to={RouteGetter.path('home')}>Return Home</LinkButton>
                </CardActions>
            </Card>
        </Container>
    )
}

export default NotFoundPage
