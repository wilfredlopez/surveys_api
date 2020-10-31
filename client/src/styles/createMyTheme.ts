import { createMuiTheme } from '@material-ui/core/styles'
import primary from '@material-ui/core/colors/brown'
import secondary from '@material-ui/core/colors/blue'

export default function createMyTheme() {
  return createMuiTheme({
    palette: {
      primary: {
        main: primary[500],
      },
      secondary: {
        main: secondary[500],
      },
    },
    tertiaryColor: 'blue',
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
}
