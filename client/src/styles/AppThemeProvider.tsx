import React, { PropsWithChildren } from 'react'
import { ThemeProvider } from '@material-ui/core'
import createMyTheme from './createMyTheme'
const theme = createMyTheme()

interface Props {

}

const AppThemeProvider = (props: PropsWithChildren<Props>) => {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}

export default AppThemeProvider
