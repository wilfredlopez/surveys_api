import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
// import IconButton from '@material-ui/core/IconButton';
// import {Menu as MenuIcon} from '@material-ui/icons';
import RouteGetter from '../RouteGetter'
import UnstyledLink from './shared/UnstyledLink'
import LinkButton from './shared/LinkButton'
import { useAppContext } from '../context/AppContext'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
)

export default function AppMenu() {
  const classes = useStyles()
  const { user } = useAppContext()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <UnstyledLink to={RouteGetter.path('home')}>
              ReSurveys
          </UnstyledLink>
          </Typography>
          {user ? <LinkButton color="textInherit" to={RouteGetter.path('account')} bold>{user.firstname.toUpperCase()}</LinkButton> :
            <LinkButton color='textInherit' to={RouteGetter.path('login')} bold>LOGIN</LinkButton>
          }
        </Toolbar>
      </AppBar>
    </div>
  )
}
