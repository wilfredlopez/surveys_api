import { Typography } from '@material-ui/core'
import React from 'react'
import { SurveyClient, SurveyQuestionClient } from 'shared'

interface Props {
    survey: SurveyClient
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
    let percent = ((ans.count / total) * 100)
    if (isNaN(percent)) {
        percent = 0
    }
    return `${ans.text} (${percent.toFixed(1)}%)`
}

interface OrganizedAnswers { total: number, answers: AnswerValue[] }



function findMissingAnswers(MAP: Record<string, OrganizedAnswers>, questions: SurveyQuestionClient[]) {
    const missing: Record<string, AnswerValue[]> = {}// output

    const orginized = Object.values(MAP)
    const selected: { [key: string]: string } = {}
    // add all selected answers to object
    for (const o of orginized) {
        for (let a of o.answers) {
            selected[a.text] = a.text
        }
    }


    const optionsArr = questions.map(q => ({ id: q._id, opt: q.options }))
    for (const option of optionsArr) {
        for (let q of option.opt) {

            if (!selected[q]) {
                if (Array.isArray(missing[option.id])) {
                    missing[option.id].push({
                        count: 0,
                        text: q
                    })
                } else {

                    missing[option.id] = [{
                        count: 0,
                        text: q
                    }]
                }
            }
        }
    }

    return missing
}


const SurveyAnswerElement = ({ survey }: Props) => {
    const questions = survey.questions.map(q => q)
    const answersMap = questions.reduce((prev, current) => {
        const ans = getUniqueAnswers(current.answers)
        return { [current._id]: { total: current.answers.length, answers: ans }, ...prev }
    }, {} as Record<string, OrganizedAnswers>)

    const missingMap = findMissingAnswers(answersMap, survey.questions)

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
                    {missingMap[q._id] || ([] as AnswerValue[]).map(ans => {
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
