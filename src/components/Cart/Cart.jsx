import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core'
import useStyles from './styles'
import CartItem from './CartItem/CartItem'
import {Link} from 'react-router-dom'

const Cart = ({ cart, handleUpdateCartQuantity, handleRemoveFromCart, handleEmptyCart }) => {
  const isEmpty = !cart.total_items
  const classes = useStyles()

  const EmptyCart = () => (
    <Typography variant='subtitle1' gutterBottom>
      You have no items in your shopping cart! <br />
      <Link to='/tumiza_project' className={classes.link}>Go back to add some...</Link>
    </Typography>
  )

  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem
              item={item}
              handleUpdateCartQuantity={handleUpdateCartQuantity}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <b>
          <Typography variant='h4'>
            Subtotal: {cart.subtotal.formatted_with_code}
          </Typography>
        </b>
        <div>
          <Button
            className={classes.emptyButton}
            size='large'
            type='button'
            variant='contained'
            color='secondary'
            onClick={() => {
              handleEmptyCart()
            }}
          >
            Empty Cart
          </Button>
          <Button
            className={classes.emptyButton}
            size='large'
            type='button'
            variant='contained'
            color='primary'
            component={Link}
            to='/tumiza_project/checkout'
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant='h3' gutterBottom>
        Your Shopping Cart
      </Typography>
      {isEmpty ? <EmptyCart /> : <FilledCart />}
    </Container>
  )
}

export default Cart
