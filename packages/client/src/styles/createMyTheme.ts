import { createMuiTheme } from '@material-ui/core/styles'
import primary from '@material-ui/core/colors/purple'
import secondary from '@material-ui/core/colors/blue'
import success from '@material-ui/core/colors/green'
import warning from '@material-ui/core/colors/red'
import tertiary from '@material-ui/core/colors/deepPurple'

export default function createMyTheme(prefersDarkMode = false) {
  const theme = createMuiTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        ...primary,
        main: '#ef5350',
        dark: '#a73a38',
        light: '#f27573',
      },
      secondary: {
        ...secondary,
        main: secondary[500],
      },
      tertiary: {
        ...tertiary,
        main: tertiary['500'],
        dark: tertiary['900'],
        light: tertiary['300'],
        contrastText: 'white',
      },
      success: {
        ...success,
        contrastText: 'white',
      },
      warning: {
        ...warning,
        main: warning['800'],
        dark: warning['900'],
        light: warning['500'],
        contrastText: 'white',
      },
    },
    shape: {
      borderRadius: 3,
    },
    mixins: {
      toolbar: {
        minHeight: 60,
      },
    },
    typography: {
      htmlFontSize: 18,
      fontSize: 16,
      fontFamily: `'Lato', sans-serif`,
      button: {
        fontFamily: `'Lato', sans-serif`,
      },
    },
  })

  return theme
}
