import { createStyles, FormControl, FormGroup, Input, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import { StringHelper } from '@wilfredlopez/react-utils'
import React from 'react'
import { BillingInfo, Plan, validateBillingInfo } from 'shared'
import { US_STATE_KEYS } from '../../constants'
import fetchUtils from '../../fetchUtils'
import useProtectedRoute from '../../hooks/useProtectedRoute'
import { useAppContext } from '../../context/AppContext'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialog: {
            minWidth: 400
        },
    }),
)

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})

export interface OrderDialogProps {
    plan: Plan
    amount: number
    open: boolean
    handleClose: (reason?: "backdropClick" | "escapeKeyDown") => void
    onRequestEnd?: () => void
}




const defaultBilling: BillingInfo = {
    address1: '',
    address2: '',
    city: '',
    state: 'NJ',
    creditCard: '',
    cvv: '',
    expiration: '',
    firstname: '',
    lastname: '',
    zipcode: ''
}

const GROUP1 = ['firstname', 'lastname', 'address1', 'address2', 'city'] as const
const GROUP2 = ['zipcode', 'creditCard', 'cvv'] as const







export default function OrderDialog({ amount, plan, open, handleClose, onRequestEnd }: OrderDialogProps) {

    const classes = useStyles()

    const sendHandleClose = (_event: {} | React.MouseEvent<HTMLAnchorElement, MouseEvent>, reason?: "backdropClick" | "escapeKeyDown") => {
        handleClose(reason)
    }


    useProtectedRoute()

    const [errorKeys, setErrorKeys] = React.useState<(keyof BillingInfo)[]>([])
    const { dispatch } = useAppContext()

    const [billingInfo, setBillingInfo] = React.useState<BillingInfo>(defaultBilling)

    async function handleSubmit() {
        const [isValid, errors] = validateBillingInfo(billingInfo)
        setErrorKeys(errors)
        if (!isValid) {
            return
        }
        try {
            const res = await fetchUtils.placeOrder({
                billing: billingInfo,
                plan: plan
            })
            if ('error' in res) {
                console.error(res)
                return
            }
            dispatch({
                type: 'setUser',
                payload: res
            })
            if (typeof onRequestEnd === 'function') {
                onRequestEnd()
            }
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    function updateValue<K extends keyof BillingInfo>(key: K, value: BillingInfo[K]) {
        if (value && value.trim() !== '') {
            const ekeys = errorKeys.filter(k => k !== key)
            setErrorKeys(ekeys)
        }
        setBillingInfo(current => ({ ...current, [key]: value }))
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        updateValue(e.target.name as any, e.target.value)
    }

    function mapToInput(k: keyof BillingInfo) {
        return <FormControl key={k}>
            <InputLabel error={errorKeys.includes(k)}>{StringHelper.toProperCase(k)}</InputLabel>
            <Input value={billingInfo[k]} name={k} onChange={handleChange}></Input>
        </FormControl>
    }


    return (
        <div>
            <form>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    PaperProps={{
                        className: classes.dialog
                    }}
                    onClose={sendHandleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Updagrade to {plan} plan</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            {GROUP1.map(mapToInput)}


                            <br />
                            <FormControl>
                                <InputLabel error={errorKeys.includes('state')}>State</InputLabel>

                                <Select value={billingInfo.state} onChange={(e) => updateValue('state', e.target.value as string)}>
                                    {US_STATE_KEYS.map(k => {
                                        return <MenuItem value={k} key={k}>{k}</MenuItem>
                                    })}
                                    <MenuItem value="NJ">NJ</MenuItem>
                                </Select>
                            </FormControl>
                        </FormGroup>

                        <FormGroup>
                            {GROUP2.map(mapToInput)}
                            <FormControl>
                                <InputLabel error={errorKeys.includes('expiration')}>Expiration Date (mm/dd/yyyy)</InputLabel>

                                <Input value={billingInfo.expiration} placeholder="MM/DD/YYYY" name={'expiration'} onChange={handleChange}></Input>
                            </FormControl>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={sendHandleClose} color="primary">
                            Cancel
          </Button>
                        <Button onClick={handleSubmit} color="primary" type="submit">
                            Upgrade (${amount})
          </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    )
}
