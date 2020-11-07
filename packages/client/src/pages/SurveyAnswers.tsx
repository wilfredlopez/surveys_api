import React from 'react'
import { SurveyClient } from 'shared'
import { useParams } from 'react-router-dom'
import SurveyAnswerElement from '../components/SurveyAnswerElement'
import { useAppContext } from '../context/AppContext'
import { Container } from '@material-ui/core'
import useProtectedRoute from '../hooks/useProtectedRoute'
interface Props {

}



const SurveyAnswers = (_: Props) => {
    const [survey, setSurvey] = React.useState<SurveyClient>()
    const { id } = useParams<{ id: string }>()
    const { actionCreators } = useAppContext()
    const client = useProtectedRoute()
    React.useEffect(() => {
        actionCreators.fetchOneSurvey(id, client.publicKey).then((sur) => {
            setSurvey(sur)
        }).catch(e => {
            console.log(e)
        })
        //eslint-disable-next-line
    }, [id])

    if (!survey) {
        return <Container>
            <h1>Survey Not Found</h1>
        </Container>
    }
    return (
        <Container>

            <SurveyAnswerElement survey={survey} />
        </Container>
    )
}

export default SurveyAnswers
