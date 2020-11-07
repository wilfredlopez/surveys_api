import React, { PropsWithChildren } from 'react'
import { ThemeProvider, useMediaQuery } from '@material-ui/core'
import createMyTheme from './createMyTheme'


interface Props {

}

const AppThemeProvider = (props: PropsWithChildren<Props>) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')



    const theme = React.useMemo(
        () =>
            createMyTheme(prefersDarkMode),
        [prefersDarkMode],
    )
    return (
        <ThemeProvider theme={theme}>

            {props.children}
        </ThemeProvider>
    )
}

export default AppThemeProvider
