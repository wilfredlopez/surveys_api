import { Typography } from '@material-ui/core'
import React from 'react'
import { SurveyClient } from 'shared'
import utils, { OrganizedAnswers } from '../utils/index'


interface Props {
    survey: SurveyClient
}




const SurveyAnswerElement = ({ survey }: Props) => {
    const questions = survey.questions.map(q => q)
    const answersMap = questions.reduce((prev, current) => {
        const ans = utils.getUniqueAnswers(current.answers)
        return { [current._id]: { total: current.answers.length, answers: ans }, ...prev }
    }, {} as Record<string, OrganizedAnswers>)

    const missingMap = utils.findMissingAnswers(answersMap, survey.questions)

    return (
        <div>
            <br />
            <Typography variant="h3" component="h1" align="center">{survey.name}</Typography>
            <br />
            {questions.map((q, qi) => {
                return <div key={q._id + qi}>
                    <Typography variant="h4" component="h2">{q.title}</Typography>
                    <Typography variant="caption">{answersMap[q._id].total} Answers</Typography>
                    {answersMap[q._id] && answersMap[q._id].answers.map((ans) => {
                        return <ul key={ans.text}>
                            <li>
                                {utils.percentText(ans, answersMap[q._id].total)}
                            </li>
                        </ul>
                    })}
                    {missingMap[q._id] && missingMap[q._id].map(ans => {
                        return <ul key={ans.text}>
                            <li>
                                {utils.percentText(ans, answersMap[q._id].total)}
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
