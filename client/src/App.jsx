import { Box, Grid, List, Button, ListItem, Paper, Typography, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material'
import React, { useEffect, useContext, useRef } from 'react'
import Header from './components/layout/Header'
import { PagesOutlined, Newspaper, GroupOutlined, Group } from '@mui/icons-material'
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

  useEffect(() => {
    if (isLoggedIn) {
      socket.current = io('http://localhost:8080')
    }
  }, [isLoggedIn])
  
  useEffect(() => {
    if (socket.current) {
      socket.current.on('connect', () => {
      })
      socket.current.emit('add-user', { user: currentUser })
    }
  },[socket.current])
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
        isLoggedIn && <Header />
      }


      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/me/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/chat-room' element={<Chats socket={socket} />} />
      </Routes>
    </>
  )
}

export default App