// import React from 'react'
import { Search, Home, Notifications, Chat } from '@mui/icons-material'
import './Header.css'
import {
  Box, Typography, TextField, InputAdornment, Button, Avatar

} from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Header = () => {
  const { user } = useSelector(state => state.auth)
  return (
    <Box className='header'>
      <Box>
        <Typography
          id='header-title'
          variant='h5'
          color='GrayText'
        >
          Sociala
        </Typography>
      </Box>
      <Box id='header-input'> 
        <TextField
        
          sx={{ height: '100%' }}
          label='search...'
          placeholder='hit enter to search'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            )
          }}
          fullWidth
        />
      </Box>

      <Box>
        <NavLink to='/newsfeed'>
          <Button sx={{borderRadius:40}}>
            <Home />
          </Button>
      </NavLink>
        <Button>
          <Notifications />
        </Button>
        <NavLink to='/chat-room'>
          <Button>
            <Chat />
          </Button>
       </NavLink>
        <NavLink to={`/profile/${user?._id}`}>
          <Avatar
            src={user?.profile}
          />
        </NavLink>
      </Box>
    </Box>
  )
}

export default Header