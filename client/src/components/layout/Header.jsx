import React, { useContext, useState } from 'react'
import { AppBar, Avatar, Box, Button, Typography } from '@mui/material'
import { HomeRounded, Notifications, MessageRounded, Settings, Search } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { AppData } from '../../context/AppContext'
import { LoadingButton } from '@mui/lab'

const Header = ({ setIsNotificationPanelOpen }) => {

  let { currentUser, pageWidth } = useContext(AppData)
let navigate = useNavigate()
  return (
    <>
      <AppBar position='fixed'
        sx={{
          padding: 0.8,
          zIndex: 9999999,
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
          {
            pageWidth >= 450 ? (
              <Typography
                variant='h5'
                component='h1'
              >Sociala.</Typography>
            ) : (
                <Typography>
                  S
                </Typography>
            )
         }
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 2
            }}
          >
            {
              pageWidth >= 1150 ? (
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
              ) : (
                  <Search />
              )
           }
            <Box>
              <Link to='/' key='homepage-link'>
              <Button
              >
                  <HomeRounded />
                </Button>
              </Link>
            </Box>
          </Box>

        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding:0.2
        }}
        >
          <Button
          onClick={()=>setIsNotificationPanelOpen(true)}
          >
            <Notifications />
          </Button>
          <Link to='/chat-room' key='chat-room-link'>
          <Button
            onClick={()=> navigate('/chat-room')}
            >
              <MessageRounded />
            </Button>
          </Link>
          {
            pageWidth >= 1150 && (
              <Link to='/settings' key='settings-link'>
                <Button>
                  <Settings />
                </Button>
              </Link>
            )
         }
          <Link to='/me/profile' key='profile-link'>
            <Avatar
            src={currentUser?.profile}
            />
          </Link>
        </Box>
      </AppBar>

    </>
  )
}

export default Header