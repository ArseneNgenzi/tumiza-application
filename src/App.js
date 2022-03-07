import React, { useEffect, useState } from 'react'
import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './components'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})

  const fetchProducts = async () => {
    const { data } = await commerce.products.list()

    setProducts(data)
  }

  const fetchCart = async () => {
    const cart = await commerce.cart.retrieve()
    setCart(cart)
  }

  const handleAddToCart = async (productID, quantity) => {
    const response = await commerce.cart.add(productID, quantity)

    setCart(response.cart)
  }

  const handleUpdateCartQuantity = async (productID, quantity) => {
    const response = await commerce.cart.update(productID, {quantity})
    setCart(response.cart)
  }
  const handleRemoveFromCart = async (productID) => {
    const response = await commerce.cart.remove(productID)
    setCart(response.cart)
  }

  const handleEmptyCart = async() => {
    const response = await commerce.cart.empty()
    setCart(response.cart)
  }

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  // console.log(products)
  console.log('CART:', cart)

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Routes>
          <Route
            exact
            path='/tumiza_project'
            element={
              <Products products={products} handleAddToCart={handleAddToCart} />
            }
          />

          <Route
            path='/tumiza_project/cart'
            element={
              <Cart
                cart={cart}
                handleUpdateCartQuantity={handleUpdateCartQuantity}
                handleRemoveFromCart={handleRemoveFromCart}
                handleEmptyCart={handleEmptyCart}
              />
            }
          />

          <Route 
            path='/tumiza_project/checkout' 
            element={<Checkout cart={cart}/>}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
