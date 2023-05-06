import React from 'react'
import './Aside.css'

const Aside = ({children}) => {
  return (
    <div
    className='aside'
    >
      {children}
    </div>
  )
}

export default Aside