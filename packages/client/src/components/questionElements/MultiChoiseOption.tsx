// import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
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





interface MultiChoiseOptionProps extends OptionProps {
}

export const MultiChoiseOption = ({ options, setAnswer }: MultiChoiseOptionProps) => {
    const classes = useStyles()
    const [selected, setSelected] = React.useState<string[]>([''])


    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const data = [...selected]
        const name = event.target.name
        const index = data.findIndex(val => val === name)
        if (index !== -1) {
            data.splice(index, 1)
        } else {
            data.push(name)
        }
        setSelected(data)
        setAnswer(data.join('\n'))
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
                            control={<Checkbox checked={selected.includes(o)} onChange={handleChange} name={o} />}
                            label={o}
                        />
                    })}
                </FormGroup>
            </FormControl>
        </div>
    )
}



export default MultiChoiseOption
