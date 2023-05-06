import React from 'react'
import type { author } from '../Post/Post'
import { Avatar, Typography } from '@mui/material'
import { NestCamWiredStand } from '@mui/icons-material'
import './Contact.css'
const Contact = (friend: author) => {
  return (
    <div className='contact'>
      <Avatar
        src={friend?.profile}
      />
      <Typography>
        {friend?.names}
      </Typography>
    </div>
  )
}

export default Contact