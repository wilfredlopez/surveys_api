import { SurveyClient } from 'shared'
import React, { PropsWithChildren } from 'react'
import { API_URL, LOCALSTORAGE_TOKEN } from '../constants'
// import createContextHook from './createContextHook'
import { createContextHook } from 'react-use-light'
import reducer, { AppContextState, actionCreators } from './reducer'
import fetchUtils from '../fetchUtils'

const initialState: AppContextState = {
    auth: {
        user: undefined,
        userErrorMessage: undefined,
        loadingUser: false,
    },
    surveys: {
        openSurveys: [],
    },
    dispatch: () => { },
    actionCreators: actionCreators,
}



export const AppContext = React.createContext(initialState)



export const AppContextProvider = (props: PropsWithChildren<{}>) => {
    const [appState, dispatch] = React.useReducer(reducer, initialState)


    //autologin
    React.useLayoutEffect(() => {
        const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
        if (token) {
            appState.dispatch({
                type: 'setLoadingUser',
                payload: true
            })
            fetchUtils.getUserWithToken(token).then(data => {
                if (!data.error) {

                    dispatch({
                        type: 'setUser',
                        payload: data.user
                    })
                }
            }).catch(e => console.log(e)).finally(() => {
                appState.dispatch({
                    type: 'setLoadingUser',
                    payload: false
                })
            })
        }
        //eslint-disable-next-line
    }, [])


    return <AppContext.Provider
        value={{ ...appState, dispatch: dispatch }}
    >
        {props.children}

    </AppContext.Provider>
}




let fetched = false


function ContextGet(context: AppContextState) {

    async function execFetch(publicKey: string) {
        const res = await fetch(API_URL + `/survey?publicKey=${publicKey}`)
        const data = await res.json()
        fetched = true
        if (data.error) {
            throw new Error(data.error)
        }
        return data.surveys as SurveyClient[]
    }
    async function fetchSurveys({ refetch, publicKey }: { refetch?: boolean, publicKey: string }) {
        if (refetch) {
            return execFetch(publicKey)
        }
        if (!fetched) {
            return execFetch(publicKey)
        } else {
            if (Array.isArray(context.surveys.openSurveys)) {
                console.log('returning from cache')
                return context.surveys.openSurveys

            } else {
                return execFetch(publicKey)
            }
        }
    }

    async function getSurvey({ id, publicKey }: { id: string, publicKey: string }) {
        const exist = context.surveys.openSurveys.find(s => s.id === id)
        if (exist) {
            return exist
        } else {
            const res = await fetchUtils.fetchOneSurvey(id, publicKey)
            return res
        }

    }
    return { ...context, ...context.auth, ...context.surveys, fetchSurveys, getSurvey }
}


export const useAppContext = createContextHook(AppContext, ContextGet)
// export const useAppContext = () => {
//     const context = React.useContext(AppContext)
//     async function fetchSurveys() {
//         if (!fetched) {
//             const res = await fetch(API_URL + "/surveys")
//             const data = await res.json()
//             fetched = true
//             return data.surveys as Survey[]
//         } else {
//             console.log('returning from cache')
//             return context.surveys.openSurveys
//         }
//     }
//     return { ...context, ...context.auth, ...context.surveys, fetchSurveys }
// }







