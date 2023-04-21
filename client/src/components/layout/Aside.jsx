import React from 'react'
import { Drawer} from '@mui/material'

const Aside = ({ children, anchor }) => {
  return (
    <Drawer variant='permanent' anchor={`${anchor}`}
      sx={{
      padding:4
    }}
    > 
          { children}
    </Drawer>
  )
}

export default Aside