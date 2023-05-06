import React from 'react'
import { CircularProgress } from '@mui/material'
import './Loading.css'

function Loading() {
  return (
    <div className='loading-container'>
      <CircularProgress
      color='inherit'
      />
    </div>
  )
}

export default Loading