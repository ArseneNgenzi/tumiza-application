import React, {useState, useEffect} from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from "@material-ui/core"
import { FormProvider, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import CustomTextField from './Checkout/CustomTextField'
import { commerce } from '../../lib/commerce'



const AddressForm = ({ checkoutToken, next, nextStep }) => {
  const [shippingCountries, setShippingCountries] = useState([])
  const [shippingCountry, setShippingCountry] = useState('')
  const [shippingSubdivisions, setShippingSubdivisions] = useState([])
  const [shippingSubdivision, setShippingSubdivision] = useState('')
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingOption, setShippingOption] = useState('')

  const methods = useForm()

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
      // console.log('COUNTRIES', countries)
    setShippingCountries(countries)
    setShippingCountry(Object.keys(countries)[10])
    // console.log('SHIPPING COUNTRY', shippingCountry)
  }

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
    setShippingSubdivisions(subdivisions)
    setShippingSubdivision(Object.keys(subdivisions)[0])
  }

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  // USEEFFECT FOR RETRIEVING COUNTRIES
  useEffect(()=>{
    fetchShippingCountries(checkoutToken.id)
  }, [])

  // USE EFFECT FOR RETRIEVING SUBDIVIONS 
  useEffect(() => {
    if(shippingCountry) {
      fetchSubdivisions(shippingCountry)
    }
  }, [shippingCountry])

  useEffect(() => {
    if (shippingSubdivision) { 
      fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
    }
  }, [shippingSubdivision])

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>

        <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
          <Grid container spacing={3}>
            <CustomTextField name='firstName' label='First Name: ' />
            <CustomTextField name='lastName' label='Last Name: ' />
            <CustomTextField name='address1' label='Address: ' />
            <CustomTextField name='email' label='Email: ' />
            <CustomTextField name='city' label='City: ' />
            <CustomTextField name='zip' label='ZIP/Postal Code: ' />

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {Object.entries(shippingCountries)
                  .map(([code, name]) => ({ id: code, label: name }))
                  .map((country) => {
                    return (
                      <MenuItem key={country.id} value={country.id}>
                        {country.label}
                      </MenuItem>
                    )
                  })}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping state</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => setShippingSubdivision(e.target.value)}
              >
                {Object.entries(shippingSubdivisions)
                  .map(([code, name]) => ({ id: code, label: name }))
                  .map((subdivision) => {
                    return (
                      <MenuItem key={subdivision.id} value={subdivision.id}>
                        {subdivision.label}
                      </MenuItem>
                    )
                  })}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {shippingOptions
                  .map((sO) => ({
                    id: sO.id,
                    label: `${sO.description} - (${sO.price.formatted_with_code})`,
                  }))
                  .map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              component={Link}
              variant='outlined'
              to='/tumiza_project/cart'
            >
              Back to Cart
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm