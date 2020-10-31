import { Box, Button, Container } from '@material-ui/core'
import React from 'react'
import { SurveySkeleton } from '../components/skeletons/SurveySkeleton'
import SurveyComponent from '../components/SurveyComponent'
import { useAppContext } from '../context/AppContext'
import { useAsync } from 'react-use-light'
interface Props {

}

export const HomePage = (_: Props) => {
    const { openSurveys, dispatch, fetchSurveys } = useAppContext()
    // const [loading, setLoading] = React.useState(true)

    const { loading, error } = useAsync(async () => {
        const surveys = await fetchSurveys()
        dispatch({
            type: 'setSurveys',
            payload: surveys
        })
        // setLoading(false)
        return surveys
    })
    // useEffectOnce(() => {
    //     fetchSurveys().then((surveys) => {
    //         dispatch({
    //             type: 'setSurveys',
    //             payload: surveys
    //         })
    //     }).catch((e) => {
    //         console.log(e)
    //     }).finally(() => {
    //         setLoading(false)
    //     })
    // })

    function refetch() {
        fetchSurveys(true).then((surveys) => {
            dispatch({
                type: 'setSurveys',
                payload: surveys
            })
        }).catch((e) => {
            console.log(e)
        })
    }
    return (
        <Container>
            <Box display="flex" alignItems="center">
                <h1>Surveys</h1>
                <Box mx={2}>

                    <Button onClick={refetch} size="small" variant="outlined">Refetch</Button>
                </Box>
            </Box>
            {error && <div><p style={{ color: 'red' }}>{error.message}</p></div>}
            {loading && <SurveySkeleton />}
            {!loading && openSurveys.length === 0 && <div>
                <p>No Surveys Found.</p>
            </div>}
            {openSurveys.map((s, index) => {
                return <SurveyComponent number={index + 1} survey={s} key={'survey' + s._id} />
            })}
            <br />
            <br />
            <br />
        </Container>
    )
}
