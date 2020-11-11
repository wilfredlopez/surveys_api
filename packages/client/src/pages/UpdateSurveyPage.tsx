import React from 'react'
import { Container } from '@material-ui/core'
import UpdateSurvey from '../components/UpdateSurvey'
import { useParams } from 'react-router-dom'
import { SurveyClient } from 'shared'
import { useAppContext } from '../context/AppContext'
import useProtectedRoute from '../hooks/useProtectedRoute'

interface Props {

}

const UpdateSurveyPage = (_props: Props) => {
    const { id } = useParams<{ id: string }>()
    const [survey, setSurvey] = React.useState<SurveyClient>()

    const client = useProtectedRoute()

    const { getSurvey } = useAppContext()

    React.useLayoutEffect(() => {
        getSurvey({ id, publicKey: client.publicKey }).then((s) => {
            setSurvey(s)
        })

        //eslint-disable-next-line
    }, [id])


    if (!survey) {
        return null
    }

    return (
        <Container>
            <h1>Update Survey</h1>
            <UpdateSurvey survey={survey} />
        </Container>
    )
}

export default UpdateSurveyPage
