import React, { useContext, useState } from 'react'
import { AppBar, Box, Button, Typography } from '@mui/material'
import { HomeRounded, Notifications, MessageRounded, Settings } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { AppData } from '../../context/AppContext'

const Header = () => {

  let { currentUser }: any = useContext(AppData)

 
  return (
    <>
      <AppBar position='fixed'
        sx={{
          padding: 0.8,
          zIndex: 99999,
          background: 'white',
          color: 'skyblue',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography
            variant='h4'
            component='h1'
          >Sociala.</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 2
            }}
          >
            <input
              style={{
                padding: 10,
                background: 'rgb(205,201,225)',
                border: 'none',
                outline: 'none',
                borderRadius: 15
              }}
              placeholder='start typing to search...'
              type="text"
            />
            <Box>
              <Link to='/'>
                <Button>
                  <HomeRounded />
                </Button>
              </Link>
            </Box>
          </Box>

        </Box>

        <Box>
          <Button>
            <Notifications />
          </Button>
          <Link to='/chat-room'>
            <Button
            >
              <MessageRounded />
            </Button>
          </Link>
          <Link to='/settings'>
            <Button>
              <Settings />
            </Button>
          </Link>
          <Link to='/me/profile'>
            <Button variant='outlined'>
              {
                currentUser?.names?.split(' ')[0]
              }
            </Button>
          </Link>
        </Box>
      </AppBar>

    </>
  )
}

export default Header