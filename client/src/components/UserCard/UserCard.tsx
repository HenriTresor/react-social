import React from 'react'
import './UserCard.css'
import { Card, Typography, Button, Box } from '@mui/material'
import {RemoveRedEye, Add } from '@mui/icons-material'

const UserCard = ({profile, names}) => {
  return (
    <Card variant='outlined' className='user-card'>
        <img
          src={profile}
        />
      <Box sx={{p:1, display:'flex', flexDirection:'column', textAligin:'center', gap:2}}>
        <Typography sx={{ mt: 5, textTransform: 'capitalize' }} color='rgb(0,0,0,0.7)' variant='h6'>
          {names}
        </Typography>
        <Button variant='contained'>
          <Add />
        </Button>
        <Button variant='outlined'>
          <RemoveRedEye />
        </Button>
     </Box>
    </Card>
  )
}

export default UserCard