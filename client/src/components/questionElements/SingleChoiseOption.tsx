import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox'
import { OptionProps } from './OptionProps.inteface'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        formControl: {
            margin: theme.spacing(0),
        },
    }),
)





interface SingleChoiseOptionProps extends OptionProps {
}

export const SingleChoiseOption = ({ options, setAnswer }: SingleChoiseOptionProps) => {
    const classes = useStyles()
    const [selected, setSelected] = React.useState('')

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSelected(event.target.name || "")
        setAnswer(event.target.name || "")
    }

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                <FormGroup>

                    {options.map(o => {
                        return <FormControlLabel
                            key={o}
                            className={classes.formControl}
                            control={<Checkbox checked={o === selected} onChange={handleChange} name={o} />}
                            label={o}
                        />
                    })}
                </FormGroup>
            </FormControl>
        </div>
    )
}



export default SingleChoiseOption
