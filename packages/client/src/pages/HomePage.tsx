import React from 'react'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    Paper,
    Typography,
} from '@material-ui/core'
import LinkButton from '../components/shared/LinkButton'
import RouteGetter from '../RouteGetter'
import Ilutstration from '../images/survey-ilustration.jpg'
import yesNoIlustration from '../images/yes-no-ilustration.jpg'
import FlexBetween from '../components/shared/FlexBetween'
import IconButtonFlex from '../styles/IconButtonFlex'
import { AddShoppingCart } from '@material-ui/icons'
import { useAppContext } from '../context/AppContext'
import { useHistory } from 'react-router-dom'

interface Props { }

const HomePage = (_: Props) => {
    const { user } = useAppContext()
    const history = useHistory()
    function redirectToPath() {
        if (user) {
            history.replace(RouteGetter.path('account'))
        } else {
            history.replace(RouteGetter.path('login'))
        }

    }
    return (
        <Paper>
            <section className='section-home main'>
                <Container>
                    <Box m='auto'>
                        <Typography variant='h4' component='h1' gutterBottom align='center'>
                            The Solution to Surveys
            </Typography>
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item sm={6}>
                                <Box display='block' maxWidth='500px' m='auto'>
                                    <img
                                        src={Ilutstration}
                                        className='img border-rad'
                                        alt=''
                                        role='presentation'
                                    />
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography variant='body1' align='right'>
                                    It has never been easier to customize your survey.
                </Typography>
                                <Typography variant='body1' align='right'>
                                    Get a public key, create and distribute your surveys around
                                    the world.
                </Typography>

                                <Box textAlign='right' paddingTop={2}>
                                    <LinkButton
                                        to={RouteGetter.path('register')}
                                        size='small'
                                        color='contained-primary'
                                        withPadding
                                    >
                                        Register now
                  </LinkButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </section>
            <section className='section-home main'>
                <Container>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={12}>
                            <Typography
                                variant='h4'
                                component='h2'
                                align='center'
                                gutterBottom
                            >
                                Create Your Own
              </Typography>
                        </Grid>

                        <Grid item sm={6} xs={12}>
                            <Typography variant='body1' align='right'>
                                Take your ideas to a new level.
              </Typography>
                            <Typography variant='body2' align='right' gutterBottom>
                                Already registered?
              </Typography>
                            <Typography align='right'>
                                <LinkButton
                                    to={RouteGetter.path('login')}
                                    color='contained-primary'
                                    size='small'
                                    withPadding
                                >
                                    Login
                </LinkButton>
                            </Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <Box display='block' maxWidth='500px' m='auto'>
                                <img src={yesNoIlustration} alt='' role='presentation' />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <Divider />
            <section className='section-home alt'>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardHeader
                                    title='Available Plans'
                                    titleTypographyProps={{
                                        variant: 'h4',
                                        component: 'h3',
                                    }}
                                    avatar={<Avatar src={yesNoIlustration} />}
                                ></CardHeader>
                                <CardContent>
                                    <List>
                                        <ListItem>
                                            <Typography
                                                variant='subtitle1'
                                                className='fullwith'
                                                gutterBottom
                                            >
                                                <FlexBetween>
                                                    Yearly Plan - $100/y{' '}
                                                    <IconButtonFlex
                                                        onClick={redirectToPath}
                                                        color='contained-success'
                                                        edge='end'
                                                        title='Yearly Plan - $100/y'
                                                    >
                                                        <AddShoppingCart />
                                                    </IconButtonFlex>
                                                </FlexBetween>
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant='subtitle1' className='fullwith'>
                                                <FlexBetween>
                                                    Monthly Plan - $10/m{' '}
                                                    <IconButtonFlex
                                                        edge='end'
                                                        onClick={redirectToPath}
                                                        color='contained-success'
                                                        title='Monthly Plan - $10/m'
                                                    >
                                                        <AddShoppingCart />
                                                    </IconButtonFlex>
                                                </FlexBetween>
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            More...
            </Grid>
                    </Grid>
                </Container>
            </section>
        </Paper>
    )
}

export default HomePage
