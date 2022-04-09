import React, {useState, useEffect} from 'react'
import {Paper, Step, Stepper, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'
import { commerce } from '../../../lib/commerce'

const steps = ['Shipping address', 'Payment details']


const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [checkoutToken, setCheckoutToken] = useState(null)
  const [shippingData, setShippingData] = useState({})
  const [isFinished, setIsFinished] = useState(false)

  const classes = useStyles()
  const history = useNavigate()



  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: 'cart',
        })
        console.log('CHECKOUT TOKEN', token)
        setCheckoutToken(token)
      } catch (error) {
        history.pushState('/tumiza_project')
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

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true)
    }, 3000);
  }

  const Form = () => {
    return activeStep === 0 ? (
      <AddressForm
        checkoutToken={checkoutToken}
        next={next}
        nextStep={nextStep}
      />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        nextStep={nextStep}
        onCaptureCheckout={onCaptureCheckout}
        timeout={timeout}
      />
    )
  }

  let Confirmation = () => order.customer ? (
      <>
        <div>
          <Typography variant="h5"> Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
          <Divider className={classes.divider}/>
          <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} to='/tumiza_project' variant="outlined" type='button'>Back to home</Button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant="h5"> Thank you for your purchase!</Typography>
          <Divider className={classes.divider}/>
        </div>
        <br />
        <Button component={Link} to='/tumiza_project' variant="outlined" type='button'>Back to home</Button>
      </>
    ) : (
      <div className={classes.spinner}> 
        <CircularProgress />
      </div>
    )
    
    // COMMENTED THIS DOWN TO IGNORE WHAT TO DISPLAY WHEN CHECKOUT ERROR OCCURS... Kulengeza tu 

  // if(error) {
  //   Confirmation = () => (
  //   <>
  //     <Typography variant="h5"> Error: {error}</Typography>
  //     <br />
  //     <Button component={Link} to='/tumiza_project' variant="outlined" type='button'>Back to home</Button>
  //   </>
  //   )
  // }

  return (
    <>
    <CssBaseline />
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