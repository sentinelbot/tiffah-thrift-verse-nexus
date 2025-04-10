
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import './App.css'

// Pages
import Index from "@/pages/Index"
import Shop from "@/pages/Shop"
import ProductDetails from "@/pages/ProductDetails"
import Cart from "@/pages/Cart"
import Checkout from "@/pages/Checkout"
import PaymentConfirmation from "@/pages/PaymentConfirmation"
import OrderConfirmation from "@/pages/OrderConfirmation"
import NotFound from "@/pages/NotFound"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="tiffah-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export default App
