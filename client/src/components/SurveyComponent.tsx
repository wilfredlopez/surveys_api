import { Button, FormHelperText, List, ListItem, Typography } from '@material-ui/core'
import React from 'react'
import { AnswerInput, Survey, QuestionType } from '../interfaces/surveyinterface'
import { SurveyQuestionElement } from './SurveyQuestionComponent'
// import { useSurveysContext } from '../context/SurveyContext'
import { Link, useHistory } from 'react-router-dom'
import RouteGetter from '../RouteGetter'
import { useAppContext } from '../context/AppContext'

interface Props {
    survey: Survey
    number: number
}

export const SurveyComponent = ({ survey, number }: Props) => {
    const [answers, setAnswers] = React.useState<AnswerInput[]>([])
    const { actionCreators } = useAppContext()
    const history = useHistory()

    function handleAnswes(value: string, questionId: string, questionType: QuestionType) {

        let answer = [value]
        if (questionType === 'multi-choice') {
            const splitted = value.split('\n').filter(v => v !== '')
            answer = splitted
        }
        const index = answers.findIndex(a => a.questionId === questionId)
        if (index !== -1) {
            const newAnswers = [...answers]
            newAnswers[index] = {
                answer: answer,
                questionId: questionId
            }
            setAnswers(newAnswers)
        } else {
            const updatedAnswers = [...answers]
            updatedAnswers.push({
                answer: answer,
                questionId: questionId
            })
            setAnswers(updatedAnswers)
        }
    }

    function handleAnswer() {

        actionCreators.addSurveyAnswers(survey._id, answers).then((good) => {
            history.push(RouteGetter.path('answers', { id: survey._id }))
        }).catch(e => {
            console.log(e)
        })
    }

    const isDisabled = answers.length !== survey.questions.length

    return (
        <div>
            <List dense subheader={<Typography variant="overline" style={{ fontSize: '1.25rem', textDecoration: 'underline' }} component="h1">{number}: {survey.name}</Typography>}>


                {survey.questions.map((q, qindex) => {
                    return <ListItem key={q._id + qindex} ><SurveyQuestionElement question={q} setAnswers={handleAnswes} /></ListItem>
                })
                }
            </List>
            <div>
                {isDisabled &&
                    <FormHelperText>Complete all answers</FormHelperText>}
                <div>

                    <Button disabled={isDisabled} variant="contained" color="primary" onClick={handleAnswer}>Submit your answers</Button>
                    <span className="left-separator"></span>
                    {/* <Link to={`/anwers/${survey._id}`}> */}
                    <Link to={RouteGetter.path('answers', { id: survey._id })}>
                        <Button variant="outlined">Answers</Button>
                    </Link>
                </div>
            </div>

            <br />
            <br />
        </div>
    )
}

export default SurveyComponent
