import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../educators/Navbar'
function Educator() {
  return (
    <div className='text-d'>
    <Navbar/>
    <div
        {<Outlet />}></div>
    </div>
  )
}

export default Educator