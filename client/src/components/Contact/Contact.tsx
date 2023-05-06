import React from 'react'
import type { author } from '../Post/Post'
import { Avatar, Typography} from '@mui/material'
import { NestCamWiredStand } from '@mui/icons-material'
import './Contact.css'
const Contact = ({_id, names ,friends, profile}: author) => {
  return (
      <div className='contact'>
          <Avatar
          src={profile}
          />
          <Typography>
              {names}
          </Typography>
    </div>
  )
}

export default Contact