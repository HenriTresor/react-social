// import React from 'react'
import { Search, Home, Notifications, Chat } from '@mui/icons-material'
import './Header.css'
import {
  Box, Typography, TextField, InputAdornment, Button, Avatar

} from '@mui/material'
import { useSelector } from 'react-redux'

const Header = () => {
  const { user } = useSelector(state => state.auth)
  return (
    <Box className='header'>
      <Box>
        <Typography
          variant='h5'
          color='GrayText'
        >
          Sociala
        </Typography>
      </Box>
      <Box>
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
        <Button>
          <Home />
        </Button>
        <Button>
          <Notifications />
        </Button>
        <Button>
          <Chat />
        </Button>
        <Avatar
          src={user?.profile}
        />
      </Box>
    </Box>
  )
}

export default Header