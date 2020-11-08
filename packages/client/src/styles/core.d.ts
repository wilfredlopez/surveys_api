export * from '@material-ui/core'

declare module '@material-ui/core' {
  export namespace PropTypes {
    type Color =
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'default'
      | 'error'
      | 'warning'
      | 'tertiary'
      | 'success'
  }
}
