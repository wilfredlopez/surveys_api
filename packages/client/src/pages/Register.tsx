import { FormControl, Input, Container, InputLabel, FormGroup, FormHelperText, Button, Typography } from '@material-ui/core'
import { Validator } from '@wilfredlopez/react-utils'
import React from 'react'
import { UserInput } from 'shared'
import fetchUtils from '../fetchUtils/index'
import { Redirect, useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import { useAppContext } from '../context/AppContext'
import { makeStyles } from '@material-ui/core/styles'
import LinkButton from '../components/shared/LinkButton'

const useStyles = makeStyles({
    formGroup: {
        maxWidth: 600,
        margin: 'auto'
    }
})

interface Props {

}

const Register = (_: Props) => {
    const history = useHistory()
    const classes = useStyles()
    const [user, setUser] = React.useState<UserInput>({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        plan: 'trial'
    })
    const { dispatch, user: stateUser } = useAppContext()
    const [resultHandle, setResultHandle] = React.useState<{ loading: boolean, errorMessage: string }>({ loading: false, errorMessage: '' })


    function buttonIsDisabled() {
        for (const [key, val] of Object.entries(user)) {
            if (key === 'email') {
                if (!Validator.isEmail(val)) {
                    return true
                }
                continue
            }
            if (val === '') {
                return true
            }
        }
        return false
    }
    function handleChange<K extends keyof UserInput>(key: K, value: UserInput[K]) {
        const updated = { ...user }
        updated[key] = value
        setUser(updated)

    }


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setResultHandle(current => ({
            errorMessage: '',
            loading: true
        }))
        fetchUtils.register(user).then(data => {
            if ('error' in data) {
                fetchUtils.handleUnauthorized(data, history)
                setResultHandle(current => ({
                    errorMessage: data.error || "",
                    loading: false
                }))
            } else {
                dispatch({
                    type: 'setUser',
                    payload: data.user
                })
                history.replace(RouteGetter.path('account'))
            }

        }).catch(e => {
            setResultHandle({
                errorMessage: e['message'] || "There was an error.",
                loading: false
            })
            fetchUtils.handleUnauthorized(e, history)
        })
    }



    if (typeof stateUser !== 'undefined') {
        return <Redirect to={RouteGetter.path('account')} />
    }


    return (
        <Container>
            <br />
            <Typography variant="h4" component="h1" align="center">Register</Typography>
            <form onSubmit={handleSubmit}>

                <FormGroup className={classes.formGroup}>
                    <FormControl>

                        <InputLabel>Email</InputLabel>
                        <StringInput errorMessage="Should be a valid email." type="email" value={user.email} onChange={(e) => handleChange('email', e.target.value)} />
                    </FormControl>
                </FormGroup>
                <FormGroup className={classes.formGroup}>
                    <FormControl>

                        <InputLabel>Password</InputLabel>
                        <StringInput errorMessage="Password is required." type="password" value={user.password} onChange={(e) => handleChange('password', e.target.value)} />
                    </FormControl>
                </FormGroup>
                <FormGroup className={classes.formGroup}>
                    <FormControl>

                        <InputLabel>Firstname</InputLabel>
                        <StringInput value={user.firstname} onChange={(e) => handleChange('firstname', e.target.value)} />
                    </FormControl>
                </FormGroup>
                <FormGroup className={classes.formGroup}>
                    <FormControl>

                        <InputLabel>Lastname</InputLabel>
                        <StringInput value={user.lastname} onChange={(e) => handleChange('lastname', e.target.value)} />
                    </FormControl>
                </FormGroup>
                <br />
                <FormGroup className={classes.formGroup}>

                    <Button disabled={(buttonIsDisabled()) || resultHandle.loading} type="submit" color="primary" variant="contained">Register</Button>
                </FormGroup>
                <div>
                    <FormHelperText variant="filled" error>{resultHandle.errorMessage}</FormHelperText>
                </div>
            </form>
            <FormGroup className={classes.formGroup}>
                <LinkButton to={RouteGetter.path('login')} color='outlined-secondary' fullWidth>Login instead</LinkButton>
            </FormGroup>
        </Container>
    )
}



const StringInput = ({ value, onChange, type = 'text', errorMessage = 'This field is required.' }: { value: string, errorMessage?: string, type?: 'email' | 'password' | 'text', onChange: ((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void) | undefined }) => {

    const [isDirty, setIsDirty] = React.useState(false)
    const checkIsValid = () => {
        if (type === 'email') {
            return Validator.isEmail(value)
        }
        return value !== ''
    }


    const isValid = checkIsValid()

    return <React.Fragment>

        <Input
            type={type}
            error={!isValid && isDirty}
            required
            onBlur={() => setIsDirty(true)}
            value={value} name={value} onChange={onChange} />
        {!isValid && isDirty &&
            <FormHelperText>{errorMessage}</FormHelperText>
        }
    </React.Fragment>
}

export default Register
