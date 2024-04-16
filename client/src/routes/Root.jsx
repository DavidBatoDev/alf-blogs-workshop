import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const Root = () => {
  return (
    <div className='wrapper'>
        <Navbar />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Root
