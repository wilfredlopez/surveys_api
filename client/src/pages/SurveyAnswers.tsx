import React from 'react'
import { Survey } from '../interfaces/surveyinterface'
import { useParams } from 'react-router-dom'
import SurveyAnswerElement from '../components/SurveyAnswerElement'
import { useAppContext } from '../context/AppContext'
import { Container } from '@material-ui/core'
interface Props {

}



const SurveyAnswers = (_: Props) => {
    const [survey, setSurvey] = React.useState<Survey>()
    const { id } = useParams<{ id: string }>()
    const { actionCreators } = useAppContext()
    React.useEffect(() => {
        actionCreators.fetchOneSurvey(id).then((sur) => {
            setSurvey(sur)
        })
        //eslint-disable-next-line
    }, [id])

    if (!survey) {
        return <Container>Survey Not Found</Container>
    }
    return (
        <Container>

            <SurveyAnswerElement survey={survey} />
        </Container>
    )
}

export default SurveyAnswers
