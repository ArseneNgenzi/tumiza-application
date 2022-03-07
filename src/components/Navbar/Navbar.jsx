import React from 'react'
import {AppBar, Toolbar, IconButton, Badge, /*MenuItem, Menu,*/ Typography} from '@material-ui/core'
import {Link, useLocation} from 'react-router-dom'
import {ShoppingCart} from '@material-ui/icons'
import logo from '../../assets/cart-logo.png'
import useStyles from './styles'

const Navbar = ({ totalItems }) => {
  const classes = useStyles()

  const location = useLocation()
  return (
    <>
      <AppBar position='fixed' className={classes.appBar} color='inherit'>
        <Toolbar>
          <Typography
            component={Link}
            to='/tumiza_project'
            variant='h6'
            className={classes.title}
            color='inherit'
          >
            <img
              src={logo}
              alt='Tumiza'
              height='25px'
              className={classes.image}
            />
            Tumiza
          </Typography>
          <div className={classes.grow}></div>
          {location.pathname === '/tumiza_project' && (
            <div className={classes.button}>
              <IconButton
                component={Link}
                to='/tumiza_project/cart'
                aria-label='Show cart items'
                color='inherit'
              >
                <Badge badgeContent={totalItems} color='secondary'>
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar  