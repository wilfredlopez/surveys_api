//eslint-disable-next-line
import { Theme } from '@material-ui/core/styles/createMuiTheme'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    tertiaryColor: string
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    tertiaryColor: string
  }
}
