import React, { FC, useEffect, lazy, Suspense, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from './hooks/useFetch'
import { rootLink } from './utils/links.js'
import { login } from './redux/AuthSlice.js'
import Header from './components/Header/Header.js'
import { io } from 'socket.io-client'
import { getOnlineUsers } from './redux/Sockets.js'
import Loading from './components/Loading/Loading.js'
import Homepage from './pages/Homepage/Homepage.js'
import People from './pages/People/People.jsx'
import Incoming from './pages/Incoming/Incoming.js'
import SinglePost from './pages/SinglePost/SinglePost.jsx'
// import Loading from './components/Loading/Loading.js'
// import ChatRoom from './pages/Chat/ChatRoom'

const Signup = lazy(() => import('./pages/Signup/Signup'))
const Login = lazy(() => import('./pages/Login/Login'))
const Profile = lazy(() => import('./pages/Profile/Profile.js'))
const NewsFeed = lazy(() => import('./pages/NewsFeed/NewsFeed'))
const ChatRoom = lazy(() => import('./pages/Chat/ChatRoom'))

const App: FC = () => {

  const { data } = useFetch(`${rootLink}/api/users/me/profile`, localStorage.getItem('access_token'))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = React.useRef(null)
  const { user, isLoggedIn } = useSelector(state => state.auth)
  const { onlineUsers } = useSelector(state => state.sockets)
  const { data: allUsers } = useFetch(`${rootLink}/api/users`, localStorage.getItem('access_token'))
  const { data: postsData, isLoading, error } = useFetch(`${rootLink}/api/posts`, localStorage.getItem('access_token'))
  const [posts, setPosts] = useState([])


  useEffect(() => {
    if (postsData?.status) {
      setPosts(postsData?.posts)
    }
  }, [postsData])

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      socket.current = io('https://sociala-server-gxvy.onrender.com')
      // socket.current = io('http://localhost:8080')
    }
  }, [])

  useEffect(() => {
    if (socket.current && user) {
      socket.current.emit('add user', user)
    }
  }, [socket.current, user])

  useEffect(() => {
    if (socket.current) {
      socket.current?.on('online users', users => {
        dispatch(getOnlineUsers({ onlineUsers: users }))
      })
    }
  }, [socket])
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


      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/newsfeed' element={<NewsFeed allUsers={allUsers} posts={posts} isLoading={isLoading } />} />
          <Route path='/chat-room' element={<ChatRoom socket={socket} />} />
          <Route path='/people' element={<People allUsers={allUsers} />} />
          <Route path='/pages' element={<Incoming />} />
          <Route path='/posts/:id' element={<SinglePost socket={socket} />} />
          <Route path='/' element={<Homepage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
