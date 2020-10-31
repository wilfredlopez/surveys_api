import Typography from '@material-ui/core/Typography'
import React from 'react'
import { SurveyQuestion, QuestionType } from '../interfaces/surveyinterface'
import SingleChoiseOption from './questionElements/SingleChoiseOption'
import { assertNever } from '@wilfredlopez/react-utils'
import MultiChoiseOption from './questionElements/MultiChoiseOption'
import OpenAnswerChoiseOption from './questionElements/OpenAnswerOption'
import { OptionProps } from './questionElements/OptionProps.inteface'

interface SurveyQuestionElementProps {
    question: SurveyQuestion
    setAnswers: (ans: string, questionId: string, questionType: QuestionType) => void
}

export const SurveyQuestionElement = ({ question, setAnswers }: SurveyQuestionElementProps) => {

    function setAnswer(value: string) {
        setAnswers(value, question._id, question.type)
    }

    const Component = renderTypeOfQuestion(question.type)

    return (
        <div>
            <Typography variant="h5" component="h2">{question.title}</Typography>
            <Component options={question.options} setAnswer={setAnswer} />
            <br />
        </div>
    )
}


function renderTypeOfQuestion<T extends OptionProps>(type: QuestionType): React.FC<T> {
    switch (type) {
        case 'single-choice':
            return SingleChoiseOption
        case 'multi-choice':
            return MultiChoiseOption
        case 'open-answer':
            return OpenAnswerChoiseOption
        default:
            assertNever(type)
            return SingleChoiseOption
    }
}






export default SurveyQuestionElement
