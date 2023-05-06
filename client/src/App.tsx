import React, { FC, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login.js'
import Profile from './pages/Profile'
import NewsFeed from './pages/NewsFeed/NewsFeed'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from './hooks/useFetch'
import { rootLink } from './utils/links.js'
import { login } from './redux/AuthSlice.js'
import Signup from './pages/Signup/Signup.js'
import ChatRoom from './pages/Chat/ChatRoom.js'
import Header from './components/Header/Header.js'
import { io } from 'socket.io-client'
import { getOnlineUsers } from './redux/Sockets.js'

const App: FC = () => {

  const { data } = useFetch(`${rootLink}/api/users/me/profile`, localStorage.getItem('access_token'))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = React.useRef(null)
  const { user, isLoggedIn } = useSelector(state => state.auth)
  const { onlineUsers } = useSelector(state => state.sockets)

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      socket.current = io('http://localhost:8080')
    }
  }, [])

  useEffect(() => {
    if (socket.current && user) {
      socket.current.emit('add user', user)
    }
  }, [socket.current, user])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('online users', users => {
        dispatch(getOnlineUsers({ onlineUsers: users }))
      })
    }
  }, [socket.current])
  useEffect(() => {
    if (!localStorage.getItem('access_token')) return navigate('/login')
  }, [])

  useEffect(() => {
    if (data?.status) {
      dispatch(login({ user: data.currentUser }))
    }
  }, [data])
  return (
    <>
      {isLoggedIn && <Header />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/newsfeed' element={<NewsFeed />} />
        <Route path='/chat-room' element={<ChatRoom socket={socket} />} />
      </Routes>
    </>
  )
}

export default App
