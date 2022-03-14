import React, {useState, useEffect} from 'react'
import {Paper, Step, Stepper, StepLabel, Typography, CircularProgress, Divider, Button} from '@material-ui/core'
import { Link } from 'react-router-dom'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'
import { commerce } from '../../../lib/commerce'

const steps = ['Shipping address', 'Payment details']


const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [checkoutToken, setCheckoutToken] = useState(null)
  const [shippingData, setShippingData] = useState({})

  const classes = useStyles()

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: 'cart',
        })
        console.log('CHECKOUT TOKEN', token)
        setCheckoutToken(token)
      } catch (error) {
        console.log(error)
      }
    }

    generateToken()
  }, [cart])

  const nextStep = () => {
    setActiveStep((prevState) => {
      return prevState + 1
    })
  }

  const backStep = () => {
    setActiveStep((prevState) => {
      return prevState - 1
    })
  }

  const next = (data) => {
    setShippingData(data)
    nextStep()
  }

  const Form = () => {
    return activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} nextStep={nextStep} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        nextStep={nextStep}
        onCaptureCheckout={onCaptureCheckout}
      />
    )
  }

  let Confirmation = () => (order.customer ? (
      <>
        <div>
          <Typography variant="h5"> Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
          <Divider className={classes.divider}/>
          <Typography variant='subtitle2'>Order ref: ref</Typography>
        </div>
        <br />
        <Button component={Link} to='/tumiza_project' variant="outlined" type='button'>Back to home</Button>
      </>
    ) : (
      <div className={classes.spinner}> 
        <CircularProgress />
      </div>
    )
    )
  

  if(error) {
    Confirmation = () => (
    <>
      <Typography variant="h5"> Error: {error}</Typography>
      <br />
      <Button component={Link} to='/tumiza_project' variant="outlined" type='button'>Back to home</Button>
    </>
    )
  }

  return (
    <>
      <div className={classes.toolbar}></div>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h4' align='center'>
            {' '}
            Checkout{' '}
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  )
}

export default Checkout