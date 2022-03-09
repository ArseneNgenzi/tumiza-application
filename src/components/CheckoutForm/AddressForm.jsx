import React, {useState, useEffect} from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from "@material-ui/core"
import { FormProvider, useForm } from 'react-hook-form'
import CustomTextField from './Checkout/CustomTextField'
import { commerce } from '../../lib/commerce'



const AddressForm = ({ checkoutToken }) => {
  const [shippingCountries, setShippingCountries] = useState([])
  const [shippingCountry, setShippingCountry] = useState('')
  const [shippingSubdivisions, setShippingSubdivisions] = useState([])
  const [shippingSubdivision, setShippingSubdivision] = useState('')
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingOption, setShippingOption] = useState('')

  const methods = useForm()

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
      console.log('COUNTRIES', countries)
    setShippingCountries(countries)
    setShippingCountry(Object.keys(countries)[0])
    // console.log('SHIPPING COUNTRY', shippingCountry)
  }

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions()
    setShippingSubdivisions(subdivisions)
    setShippingSubdivision(Object.keys(subdivisions)[0])
  }

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

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        {/* {console.log(methods)} */}
        <form>
          <Grid container spacing={3}>
            <CustomTextField required name='firstName' label='First Name: ' />
            <CustomTextField required name='lastName' label='Last Name: ' />
            <CustomTextField required name='address1' label='Address: ' />
            <CustomTextField required name='email' label='Email: ' />
            <CustomTextField required name='city' label='City: ' />
            <CustomTextField required name='zip' label='ZIP/Postal Code: ' />

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
            {/* <Grid item xs={12} sm={6}>
              <InputLabel>Shipping subdivision</InputLabel>
              <Select value={} fullWidth onChange={}>
                <MenuItem key={} value={}> Select me </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping options</InputLabel>
              <Select value={} fullWidth onChange={}>
                <MenuItem key={} value={}> Select me </MenuItem>
              </Select>
            </Grid> */}
          </Grid>
        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm