import { Input } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { OptionProps } from './OptionProps.inteface'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            width: '100%'
        },
        formControl: {
            margin: theme.spacing(0),
            width: '100%'
        },
    }),
)





interface OpenAnswerChoiseOptionProps extends OptionProps {
}

export const OpenAnswerChoiseOption = ({ options, setAnswer }: OpenAnswerChoiseOptionProps) => {
    const classes = useStyles()
    const [selected, setSelected] = React.useState('')

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSelected(event.target.value)
        setAnswer(event.target.value)
    }

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                <FormGroup >
                    <Input fullWidth multiline rows='auto' onChange={handleChange} value={selected} placeholder="Type your answer" />
                </FormGroup>
            </FormControl>
        </div>
    )
}



export default OpenAnswerChoiseOption
