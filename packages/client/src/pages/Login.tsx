import { FormControl, FormHelperText, Input, InputLabel, Container, Box, Typography } from '@material-ui/core'
import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Validator } from '@wilfredlopez/react-utils'
import UnstyledLink from '../components/shared/UnstyledLink'
import { useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import { useAppContext } from '../context/AppContext'

import fetchUtils from '../fetchUtils/index'
import ButtonFlex from '../styles/ButtonFlex'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(1),
            '& .MuiFormControl-root': {
                display: 'flex'
            },
        },
    }),
)

interface Props {

}


const Login = (_: Props) => {
    const emailRef = React.useRef<HTMLInputElement>()
    const passwordRef = React.useRef<HTMLInputElement>()
    const [emailError, setEmailError] = React.useState<string>()
    const [passwordError, setPasswordError] = React.useState<string>()
    const classes = useStyles()
    const { userErrorMessage: errorMessage, user, dispatch } = useAppContext()
    const history = useHistory()


    React.useEffect(() => {
        if (user) {
            history.replace(RouteGetter.path('account'))
        }
        //eslint-disable-next-line
    }, [user])


    function isValidForm() {
        return typeof passwordError === 'undefined' && typeof emailError === 'undefined'
    }

    function validateField(type: 'email' | 'password', value: string | undefined): boolean {
        switch (type) {
            case 'email':
                if (Validator.isEmail(value)) {
                    setEmailError(undefined)
                    return true
                }
                setEmailError('Email most be valid.')
                return false
            case 'password':
                if (!value) {
                    setPasswordError('Password Most Not be Empty')
                    return false
                }
                const MinLen = 5
                if (value.length < MinLen) {
                    setPasswordError(`Password most contain at least ${MinLen} characters`)
                    return false
                }
                setPasswordError(undefined)
                return true
            default:
                return false
        }
    }


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValidForm()) {
            return
        }
        const email = emailRef.current!.value
        if (!validateField('email', email)) {
            return
        }
        const passowrd = passwordRef.current!.value
        if (!validateField('password', passowrd)) {
            return
        }

        fetchUtils.login({ email, password: passowrd }).then(data => {
            if (data.error) {
                throw new Error(data.error)
            }
            if (data.user) {
                dispatch({ 'type': 'setUser', payload: data.user })
            }
        }).catch(e => {
            if (e instanceof Error) {

                dispatch({
                    type: 'setUserError',
                    payload: {
                        error: e.message
                    }
                })
            } else {
                console.log(e)
            }
        })

    }


    const isButtonDisabled = !isValidForm()


    return (
        <Container maxWidth="sm">
            <br />
            <Typography variant="h4" align="center" component="h1">Login</Typography>
            <form className={classes.root} onSubmit={handleSubmit}>
                <FormControl>
                    <InputLabel htmlFor="email-input">Email</InputLabel>
                    <Input inputProps={
                        { ref: emailRef }
                    } id="email-input"
                        onBlur={(e) => {
                            validateField('email', e.target.value)
                        }}
                        aria-describedby="email-helper-text" type="email" />
                    <FormHelperText error={emailError !== undefined} id="email-helper-text">{emailError}</FormHelperText>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="password-input">Password</InputLabel>
                    <Input
                        onBlur={(e) => {
                            validateField('password', e.target.value)
                        }}
                        inputRef={passwordRef} id="password-input" type="password" aria-describedby="password-helper-text" />
                    <FormHelperText error={passwordError !== undefined} id="password-helper-text">{passwordError}</FormHelperText>
                </FormControl>
                <div>
                    <FormHelperText error>{errorMessage}</FormHelperText>
                </div>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <ButtonFlex type="submit" disabled={isButtonDisabled} color="contained-info">Login</ButtonFlex>
                    <UnstyledLink to={RouteGetter.path('register')} color="blue">Create your Account</UnstyledLink>
                </Box>
            </form>
        </Container>
    )
}

export default Login
