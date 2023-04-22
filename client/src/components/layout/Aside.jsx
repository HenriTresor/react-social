import React, {useContext, useState} from 'react'
import { Button, Drawer } from '@mui/material'
import { AppData } from '../../context/AppContext'

const Aside = ({ children, anchor }) => {
  let { pageWidth, isDrawerOpen, setIsDrawerOpen } = useContext(AppData)
  return (
      <>
      <Drawer
        open={isDrawerOpen}
        variant= {pageWidth >= 1150 ? 'permanent': 'temporary'}
        anchor={`${anchor}`}
          sx={{
            padding: 4
          }}
        >
          {children}
      </Drawer>
    
      </>
  )
}

export default Aside