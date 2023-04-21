import { Box, Grid, List, Button, Badge, ListItem, Paper, Typography, ListItemAvatar, ListItemText, ListItemButton, Snackbar } from '@mui/material'
import React, { useEffect, useContext, useRef, useState } from 'react'
import Header from './components/layout/Header'
import { PagesOutlined, Newspaper, GroupOutlined, CloseRounded, Group, Notifications } from '@mui/icons-material'
import { AppData } from './context/AppContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { serverLink } from './utils/links.js'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useNavigate, useLocation } from 'react-router-dom'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings'
import Chats from './pages/Chats'
import { io } from 'socket.io-client'

const App = () => {
  let { setUsers, setPages, setCurrentUser, currentUser, isLoggedIn, setIsLoggedIn } = useContext(AppData)

  const socket = useRef(null)
  const [globalSnackBarOpen, setGlobalSnackBarOpen] = useState(false)
  const [globalSnackBarMsg, setGlobalSnackBarMsg] = useState('')
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  let [notifications, setNotifications] = useState([
    {
      title: 'new message',
      time: Date.now()
    },
    {
      title: 'new post',
      time: Date.now()
    },
    {
      title: 'new message',
      time: Date.now()
    },
    {
      title: 'new post',
      time: Date.now()
    },
    {
      title: 'new message',
      time: Date.now()
    },
    {
      title: 'new post',
      time: Date.now()
    },
    {
      title: 'new message',
      time: Date.now()
    },
    {
      title: 'new post',
      time: Date.now()
    },
  ])
  useEffect(() => {
    if (isLoggedIn) {
      socket.current = io('https://sociala-server-gxvy.onrender.com')
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('connect', () => {
      })
      socket.current.emit('add-user', { user: currentUser })
    }
  }, [socket.current])
  let navigate = useNavigate()
  let location = useLocation()
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: async function () {
      const usersRes = await axios.get(`${serverLink}/users`)
      const pageRes = await axios.get(`${serverLink}/pages`)

      return {
        usersRes,
        pageRes
      }
    }
  })

  useEffect(() => {
    setUsers(data?.usersRes?.data.users)
    setPages(data?.pageRes?.data.pages)
  }, [data])


  const getUser = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${serverLink}/users/me/profile`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer ' + token
        }
      })
      const data = await res.json()
      setCurrentUser(data.currentUser)
      setIsLoggedIn(true)
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getUser()
    }
    else {
      location.pathname === '/signup' ? navigate('/signup') : navigate('/login')
    }

  }, [])
  return (
    <>

      {
        isNotificationPanelOpen && (

          <Box
            className='notifications'
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 1,
                borderBottom: '2px solid grey',
                position: 'fixed',
                width: '50dvw',
                background:'white'
              }}
            >
              <Button
                onClick={() => setIsNotificationPanelOpen(false)}
                color='warning'
                variant='contained'
              >
                <CloseRounded />
              </Button>
              <Typography>
                Notifications
              </Typography>
              <Badge color='primary' badgeContent={3}>
                <Notifications />
              </Badge>
            </Box>

            <Box
              sx={{
                marginTop: 2,
               
              }}
            >
              {
                notifications?.map(notification => {
                  return (
                    <Paper
                      elevation={6}
                      key={notification?.time}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 2,
                        cursor: 'pointer',
                        marginBottom:2
                    }}
                    >
                      <Typography>
                        {notification?.title}
                      </Typography>
                      <Typography>
                        {new Date(notification?.time).toLocaleTimeString()}, {new Date(notification?.time).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  )
                })
              }
             
            </Box>
          </Box>
        )
      }

      {
        isLoggedIn && <Header
          isNotificationPanelOpen={isNotificationPanelOpen}
          setIsNotificationPanelOpen={setIsNotificationPanelOpen}
        />
      }

      {
        globalSnackBarOpen && (
          <Snackbar
            open={globalSnackBarOpen}
            autoHideDuration={7000}
            onClose={() => setGlobalSnackBarOpen(false)}
            message={globalSnackBarMsg}
          >

          </Snackbar>
        )
      }

      <Routes>
        <Route path='/' element={<HomePage
          isNotificationPanelOpen={isNotificationPanelOpen}
          setIsNotificationPanelOpen={setIsNotificationPanelOpen} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/me/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/chat-room' element={<Chats socket={socket}
          setGlobalSnackBarMsg={setGlobalSnackBarMsg}
          setGlobalSnackBarOpen={setGlobalSnackBarOpen} />} />
      </Routes>
    </>
  )
}

export default App