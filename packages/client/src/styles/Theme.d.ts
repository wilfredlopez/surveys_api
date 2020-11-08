//eslint-disable-next-line
import { Theme } from '@material-ui/core/styles/createMuiTheme'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {}
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {}
}

declare module '@material-ui/core/styles/createPalette' {
  export interface Palette {
    tertiary: PaletteColor
  }
  export interface PaletteOptions {
    tertiary: PaletteColorOptions
  }
}
