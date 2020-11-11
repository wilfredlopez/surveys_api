import React from 'react'
import { Box, Container, Typography } from '@material-ui/core'
import ButtonFlex from '../styles/ButtonFlex'
import RouteGetter from '../RouteGetter'

interface Props {

}

const ThankYouPage = (props: Props) => {
    return (
        <Container maxWidth="md">
            <Box textAlign="center">

                <Box mt={4}>

                    <Typography variant="h3" component="h1">Thank you for your answers.</Typography>
                </Box>
                <Box mt={2}>
                    <ButtonFlex href={RouteGetter.path('home')} color="outlinedSuccess" size="small">Return Home</ButtonFlex>
                </Box>
            </Box>
        </Container>
    )
}

export default ThankYouPage
