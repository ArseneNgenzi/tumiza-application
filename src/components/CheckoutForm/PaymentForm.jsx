import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core'
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Review from './Review'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const PaymentForm = ({ checkoutToken, backStep, onCaptureCheckout, shippingData, nextStep, timeout }) => {

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault()

    if (!stripe || !elements) { 
      return
    }

    const cardElement = elements.getElement(CardElement)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      console.log('[ERROR] => ', error)
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        // line_items: {
        //   item_7RyWOwmK5nEa2V: {
        //     quantity: 1,
        //     variant_id: 'vrnt_bO6J5apWnVoEjp',
        //   },
        // },
        customer: {
          firstname: shippingData.firstName,
          lastname: shippingData.lastName,
          email: shippingData.email,
        },
        shipping: {
          name: 'primary',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
        },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
        fulfillment: {
          shipping_method: shippingData.shippingOption,
        },
        // billing: {
        //   name: 'John Doe',
        //   street: '234 Fake St',
        //   town_city: 'San Francisco',
        //   county_state: 'US-CA',
        //   postal_zip_code: '94103',
        //   country: 'US',
        // },
      }

      onCaptureCheckout(checkoutToken.id, orderData)

      timeout();

      nextStep()
      console.log("ORDER_DATA: ",orderData)
    }
  } 

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>
        {' '}
        Payment Method{' '}
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br /> <br />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='outlined' onClick={backStep}>
                  Back
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={!stripe}
                  color='primary'
                >
                  Pay {checkoutToken.live.subtotal.formatted_with_code}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}

export default PaymentForm