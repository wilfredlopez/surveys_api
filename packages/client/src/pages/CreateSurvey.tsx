import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Input, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import React from 'react'
import { ExpectedCreate, SharedUtils, QuestionInput, QuestionType } from 'shared'
import fetchUtils from '../fetchUtils/index'
import { useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import useProtectedRoute from '../hooks/useProtectedRoute'
import { StringHelper } from '@wilfredlopez/react-utils'
interface Props {

}
function hasErrorKey<T extends { error: any }>(t: unknown): t is T {
    return typeof t === 'object' && t !== null && 'error' in t
}

const useStyles = makeStyles(theme => ({
    cardRoot: {
        marginTop: theme.spacing(2)
    },
    cardContent: {
        justifyContent: 'space-around',
        alignItems: "center",
        display: "flex",
        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridGap: theme.spacing(3),
        }
    },
    cardActions: {
        justifyContent: 'flex-end'
    },
    formControl: {
        width: '100%'
    }
}))




const QuestionTypes: Record<QuestionType, QuestionType> = {
    "multi-choice": 'multi-choice',
    "open-answer": 'open-answer',
    "single-choice": 'single-choice'
}


interface MessageSuccessOrError {
    text: string,
    type: 'succcess' | 'error'
}


const CreateSurvey = (_: Props) => {
    const [autoOpen, setAutoOpen] = React.useState(true)
    const [name, setName] = React.useState<string>("")
    useProtectedRoute()
    const [message, setMessage] = React.useState<MessageSuccessOrError>({
        text: '',
        type: 'succcess'
    })
    const classes = useStyles()
    const [questions, setQuestions] = React.useState<QuestionInput[]>([
        {
            options: [],
            title: '',
            type: 'multi-choice',
        },
    ])


    const history = useHistory()



    function resetForm() {
        setQuestions([
            {
                options: [],
                title: '',
                type: 'multi-choice',
            }])
        setName('')
    }






    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const survey: ExpectedCreate = {
            name: name,
            open: autoOpen,
            questions: questions,
        }
        const [error, isValid] = SharedUtils.validateCreate(survey)
        if (!isValid) {
            setMessage({
                text: error,
                type: 'error'
            })
            return
        }
        fetchUtils.postNewSurvey(survey).then((res) => {
            if (res.error) {
                setMessage({
                    text: res.error,
                    type: 'error'
                })
                return
            }

            fetchUtils.handleUnauthorized(res, history)
            setMessage({
                text: 'Survey created',
                type: 'succcess'
            })
            resetForm()
            setTimeout(() => {
                history.replace(RouteGetter.path('answers', { id: res.id }))

            }, 3000)


        }).catch((e: unknown) => {
            console.log(e)
            if (e instanceof Error) {
                fetchUtils.handleUnauthorized({ error: e.message }, history)
                setMessage({
                    text: e.message,
                    type: 'error'
                })
            } else if (hasErrorKey(e)) {

                setMessage({
                    text: e.error,
                    type: 'error'
                })
            }
        })

    }





    function updateQuestionOptions(values: string, index: number) {
        const splitted = values.split('\n')
        const opts = splitted.filter(s => s !== '')
        const updatedQuestions = [...questions]
        updatedQuestions[index].options = opts
        setQuestions(updatedQuestions)
    }


    function updateQuestionType(type: QuestionType, index: number) {
        const updatedQuestions = [...questions]
        updatedQuestions[index].type = type
        setQuestions(updatedQuestions)
    }

    function updateQuestionTitle(title: string, index: number) {
        const updatedQuestions = [...questions]
        updatedQuestions[index].title = title
        setQuestions(updatedQuestions)
    }


    function removeQuestion(index: number) {
        if (index === 0) {
            setMessage({
                text: "At least one questions most be present",
                type: 'error'
            })
            return
        }
        let updatedQuestions = [...questions]
        updatedQuestions.splice(index, 1)
        setQuestions(updatedQuestions)
    }


    function addEmptyQuestion() {
        const q: QuestionInput = {
            options: [],
            title: '',
            type: 'multi-choice'
        }
        const updated = [...questions]
        updated.push(q)
        setQuestions(updated)
    }

    function resetMessage() {
        setMessage({
            type: 'succcess',
            text: ''
        })
    }



    return (
        <Container>
            <h1>Create Survey</h1>
            <form onSubmit={handleSubmit}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="name-input">Name</InputLabel>
                    <Input

                        fullWidth
                        placeholder="Survey Name"
                        value={name} onChange={(e) => {
                            setName(e.target.value)
                            resetMessage()
                        }}
                        id="name-input"
                    ></Input>
                </FormControl>

                {questions.map((q, index) => {
                    return <div key={index + '-question'} >
                        <Card className={classes.cardRoot}>
                            <CardHeader
                                title={`Question ${index + 1}`}
                            >

                            </CardHeader>
                            <CardContent className={classes.cardContent}>

                                <FormControl >
                                    <InputLabel htmlFor={`question-${index}`}>Title</InputLabel>
                                    <Input
                                        value={q.title} onChange={(e) => {

                                            updateQuestionTitle(e.target.value, index)
                                            resetMessage()
                                        }}
                                        id={`question-${index}`}
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <InputLabel id={`label-question-${index}`}>Type</InputLabel>
                                    <Select
                                        labelId={`label-question-${index}`}
                                        value={q.type} onChange={(e) => {
                                            updateQuestionType(e.target.value as any, index)
                                        }}>
                                        <MenuItem value={QuestionTypes['multi-choice']}>{QuestionTypes['multi-choice']}</MenuItem>
                                        <MenuItem value={QuestionTypes['open-answer']}>{QuestionTypes['open-answer']}</MenuItem>
                                        <MenuItem value={QuestionTypes['single-choice']}>{QuestionTypes['single-choice']}</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        id={`survey-options-q-${index}`}
                                        label="Options"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        onChange={(e) => {
                                            const values = e.target.value
                                            updateQuestionOptions(values, index)
                                            resetMessage()
                                        }}
                                        variant="outlined"
                                    >

                                    </TextField>
                                </FormControl>
                            </CardContent>
                            <CardActions className={classes.cardActions}>
                                <Button variant="outlined" size="small" onClick={() => removeQuestion(index)}>Remove</Button>
                            </CardActions>
                        </Card>
                    </div>
                })}
                <br />
                <Button size="small" variant="outlined" onClick={() => addEmptyQuestion()} >Add More Questions</Button>
                <FormGroup>
                    <br />
                    <br />
                    <FormControlLabel
                        control={<Checkbox
                            checked={autoOpen}
                            onChange={(e) => setAutoOpen(e.target.checked)}
                            inputProps={{ 'aria-label': 'Auto Open Survey' }}
                        />}
                        label="Auto Open"
                    />

                </FormGroup>

                <FormGroup>
                    <br />
                    <br />
                    <FormControl>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </FormControl>
                </FormGroup>
            </form>
            <br />
            <br />
            {message.text &&

                <Card>

                    <CardHeader
                        subheader={StringHelper.toProperCase(message.type)}
                    >
                    </CardHeader>
                    <CardContent>

                        <Typography align="center" variant={'body1'} style={{
                            color: message.type === 'error' ? 'red' : 'green'
                        }}>{message.text}</Typography>
                    </CardContent>
                </Card>
            }
            <br />
            <br />  <br />
            <br />
        </Container>
    )
}



export default CreateSurvey
