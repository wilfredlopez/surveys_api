import React, { PropsWithChildren } from 'react'
import { SkeletonThemeProvider } from 'wl-react-skeleton'
import { AppContextProvider } from './context/AppContext'
import AppThemeProvider from './styles/AppThemeProvider'


interface Props {

}

export const RootProviders = (props: PropsWithChildren<Props>) => {
    return (
        <AppContextProvider>
            <AppThemeProvider>

                <SkeletonThemeProvider>
                    {props.children}
                </SkeletonThemeProvider>
            </AppThemeProvider>
        </AppContextProvider>
    )
}
