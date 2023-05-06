import { FC, useEffect } from 'react'
// import { useSelector } from 'react-redux/es/exports'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login.js'
import Profile from './pages/Profile'
import NewsFeed from './pages/NewsFeed/NewsFeed'
import { useDispatch } from 'react-redux'
import useFetch from './hooks/useFetch'
import { rootLink } from './utils/links.js'
import { login } from './redux/AuthSlice.js'
import Signup from './pages/Signup/Signup.js'

const App: FC = () => {

  const { data } = useFetch(`${rootLink}/api/users/me/profile`, localStorage.getItem('access_token'))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.getItem('access_token') && localStorage.removeItem('access_token')
  }, [])
  useEffect(() => {
    if (!localStorage.getItem('access_token')) return navigate('/login')
  }, [])
  useEffect(() => {
    if (data?.status) {
      dispatch(login({ user: data.currentUser }))
    }
  }, [data])
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/newsfeed' element={<NewsFeed />} />
    </Routes>
  )
}

export default App
