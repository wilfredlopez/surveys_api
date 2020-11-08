import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, FormGroup, List, ListItem, Typography, Select, MenuItem, InputLabel, Divider, Paper } from '@material-ui/core'
import React from 'react'
import { useBoolean } from 'react-use-light'
import LinkButton from '../components/shared/LinkButton'
import { useAppContext } from '../context/AppContext'
import useProtectedRoute from '../hooks/useProtectedRoute'
import RouteGetter from '../RouteGetter'
import { Plan } from '../../../shared/src/interfaces/userInterfaces'
import OrderDialog from '../components/shared/OrderDialog'
import ButtonFlex from '../styles/ButtonFlex'
import { API_URL } from '../constants'

interface Props {

}

const plans: Plan[] = ['monthly', 'yearly']

const prices: Record<Plan, { amount: number, text: string }> = {
    monthly: {
        amount: 10,
        text: '$10/m'
    },
    trial: {
        amount: 0,
        text: '$0'
    },
    yearly: {
        amount: 100,
        text: '$100/y'
    }
}

let timeoutTime: NodeJS.Timeout
export const Account = (props: Props) => {
    const { dispatch } = useAppContext()
    const user = useProtectedRoute()

    const [selectedPlan, setSelectedPlan] = React.useState<Plan>(user.plan)

    const [copied, setCopied] = useBoolean(false)
    const [showKeys, setShowKeys] = useBoolean(false)
    const [showOrderComponent, setShowOrderComponent] = useBoolean(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log(selectedPlan)
        setShowOrderComponent(true)
    }

    const isSamePlan = selectedPlan === user.plan

    const prot = window.location.protocol
    const key = `${prot}//${window.location.host}${RouteGetter.path('display-surveys', { publicKey: user.publicKey })}`

    function copyKey() {
        navigator.clipboard.writeText(key)
        setCopied(true)
        if (typeof timeoutTime !== 'undefined') {
            clearTimeout(timeoutTime)
        }
        timeoutTime = setTimeout(() => {
            setCopied(false)
            console.log('setting false')

        }, 1500)
    }

    return (


        <Container>
            <br />
            {/* <Typography variant="h3" component="h1" gutterBottom>Account</Typography> */}
            <Card>
                <CardHeader
                    title={`${user.firstname} ${user.lastname}`}
                    avatar={<img src={user.avatar} alt={user.firstname} />}
                    subheader={user.email}
                >

                    <p>{user.firstname} {user.lastname}</p>
                </CardHeader>
                <CardContent>
                    <List>
                        <ListItem>
                            <Typography>

                                <b>Plan:</b>{" "} {user.plan.toUpperCase()}
                            </Typography>
                        </ListItem>

                        <KeyItemElement label="PubicKey" show={showKeys} value={user.publicKey} />
                        <KeyItemElement label="PrivateKey" show={showKeys} value={user.privateKey} />
                        <ListItem>

                            <Button variant="outlined" size="small" onClick={() => setShowKeys()}>{showKeys ? "Hide" : "Show    "} Keys</Button>
                        </ListItem>
                    </List>
                </CardContent>
                <CardActions id="account-action-grid">
                    <LinkButton fullWidth to={RouteGetter.path('create-survey')} color="contained-success" size="small" withPadding>Create Survey</LinkButton>

                    <LinkButton fullWidth to={RouteGetter.path('display-surveys', { publicKey: user.publicKey })} color="contained-success" size="small" withPadding>Views Surveys</LinkButton>

                    <LinkButton fullWidth to={RouteGetter.path('edit-surveys')} color="contained-success" size="small" withPadding>Edit Surveys</LinkButton>

                    <ButtonFlex onClick={() => dispatch({ type: 'logout' })} color="outlined-warning" size="small" disableUppercase  >Logout</ButtonFlex>

                </CardActions>
            </Card>

            <br />
            <Divider />
            <br />

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title="Upgrade Plan"
                    >

                    </CardHeader>

                    <CardContent>

                        <FormGroup >


                            <FormControl>
                                <InputLabel filled htmlFor="plan-input"
                                    error={isSamePlan}
                                >Plan {selectedPlan} {isSamePlan && "(Current)"}</InputLabel>
                                <Select id="plan-Select" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value as any)}>
                                    {plans.map(p => {
                                        return <MenuItem key={p + "plan-key"} value={p}>{p}</MenuItem>
                                    })}

                                </Select>
                            </FormControl>

                            <FormControl>
                                <p>

                                    Price: {prices[selectedPlan].text}
                                </p>
                            </FormControl>

                        </FormGroup>
                    </CardContent>
                    <CardActions>

                        <div>

                            <Button disabled={isSamePlan} type="submit">Upgrade</Button>
                        </div>
                    </CardActions>
                </Card>
            </form>

            <div>
                <OrderDialog
                    open={showOrderComponent}
                    plan={selectedPlan}
                    amount={prices[selectedPlan].amount}
                    handleClose={() => setShowOrderComponent(false)}
                    onRequestEnd={() => setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                        })
                    }, 8000)}
                />
            </div>
            <br />
            <br />
            <Paper>
                <br />
                <Typography variant="h4" component="h2" align="center">Usage</Typography>
                <div className="p-2">
                    <Typography variant="body1">
                        Prodived your public API key, you are allowed to make requests for the surveys and add updates to it.
                    </Typography>
                    <br />
                    <Typography>
                        You can use the following link to show your surveys.
                        <br />

                    </Typography>
                    <span className={`key-paragraph show example-link`}>
                        <ButtonFlex disableUppercase size="small" color="text-info" onClick={() => copyKey()}>
                            {key}
                        </ButtonFlex>
                    </span>
                    {copied && <p>Copied</p>}

                    <br />
                    <Typography variant="h5" component="h3" gutterBottom>Examples: </Typography>
                    <Typography variant="body1">
                        GET {API_URL}/surveys?publicKey=YOUR_API_KEY
                    </Typography>
                </div>
            </Paper>
        </Container>
    )
}







const KeyItemElement = ({ show, value, label = "Key" }: { show: boolean, value: string, label?: string }) => {
    return <ListItem>
        <div>
            <b>{label}:{" "}</b>
            <p className={`key-paragraph ${show ? 'show' : ""}`}>
                {value}
            </p>
        </div>
    </ListItem>
}


export default Account
