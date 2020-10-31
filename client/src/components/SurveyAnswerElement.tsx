import { Typography } from '@material-ui/core'
import React from 'react'
import { Survey } from '../interfaces/surveyinterface'

interface Props {
    survey: Survey
}

interface AnswerValue {
    text: string
    count: number
}

function getUniqueAnswers(ans: string[]) {
    const unique: Record<string, AnswerValue> = {}

    for (let answer of ans) {
        if (unique[answer]) {
            unique[answer].count = unique[answer].count + 1
            continue
        }
        unique[answer] = {
            text: answer,
            count: 1
        }
    }
    return Object.values(unique).sort((a, b) => b.count - a.count) as AnswerValue[]
}



function percentText(ans: AnswerValue, total: number) {
    return `${ans.text} (${((ans.count / total) * 100).toFixed(1)}%)`
}

interface OrganizedAnswers { total: number, answers: AnswerValue[] }


const SurveyAnswerElement = ({ survey }: Props) => {
    const questions = survey.questions.map(q => q)
    const answersMap = questions.reduce((prev, current) => {
        const ans = getUniqueAnswers(current.answers)
        return { [current._id]: { total: current.answers.length, answers: ans }, ...prev }
    }, {} as Record<string, OrganizedAnswers>)

    return (
        <div>
            <br />
            <Typography variant="h3" component="h1" align="center">{survey.name}</Typography>
            <br />
            {questions.map((q, qi) => {
                return <div key={q._id + qi}>
                    <Typography variant="h4" component="h2">{q.title}</Typography>
                    <Typography variant="caption">{answersMap[q._id].total} Answers</Typography>
                    {answersMap[q._id].answers.map((ans) => {
                        return <ul key={ans.text}>
                            <li>
                                {percentText(ans, answersMap[q._id].total)}
                            </li>
                        </ul>
                    })}
                    <br />
                </div>
            })}
        </div>
    )
}

export default SurveyAnswerElement
