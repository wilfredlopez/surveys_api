import React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import RouteGetter from '../RouteGetter'

interface Props {

}

export const DisplaySurveysPage = (_: Props) => {
    const { publicKey } = useParams<{ publicKey: string }>()
    return <Redirect to={
        {
            pathname: RouteGetter.path('display-surveys-state'),
            state: {
                publicKey
            }
        }
    } />
}
