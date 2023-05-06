import { FC, useState, useReducer, useEffect } from 'react'
import {
  Container,
  Box, Button, TextField,
  Typography, Alert, Snackbar, InputLabel
} from '@mui/material'
import '../registeration/reg.css'
import LoginAvatar from '../../assets/login-avatar.png'
import axios from 'axios'
import { rootLink } from '../../utils/links.js'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/AuthSlice.js'
import { useNavigate ,Link } from 'react-router-dom'

interface credentials {
  email?: string,
  password?: string
}

interface error {
  state?: boolean,
  message?: string
}
interface state {
  loading?: boolean,
  error?: error,
  data?: string
}
interface action {
  payload?: object,
  type?: string
}
const reducer = (state: state, action: action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, data: action.payload }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: { state: true, message: action.payload } }
    default:
      return { ...state, error: { state: false, message: null }, loading: false }
  }
}
const Login: FC = () => {
  const { isLoggedIn } = useSelector(state => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    isLoggedIn && navigate('/newsfeed')
  }, [isLoggedIn])
  const [{ loading, error, data }, dispatch] = useReducer<any>(reducer, {
    loading: false,
    error: { state: false, message: null },
    data: null
  })
  const [inputValues, setInputValues] = useState<credentials | null>({
    email: '',
    password: ''
  })
  const reduxDisptacher = useDispatch()

  const handleChange = (e: any) => {
    setInputValues((prev: inputValues) => {
      return {
        ...prev,
        [e.target?.name]: e.target.value
      }
    })


  }

  const handleSubmit = async () => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const res = await fetch(`${rootLink}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inputValues })
      })

      const data = await res.json()
      if (!data.status) {
        throw new Error(data.message)
        return
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.message })
      await reduxDisptacher(login({ user: data.user }))
      localStorage.setItem('access_token', data.access_token)
      navigate('/newsfeed')
    } catch (error) {

      dispatch({ type: 'LOGIN_ERROR', payload: error.message })
    }
  }
  return (
    <Container
      sx={{ minHeight: '100dvh', display: 'flex', justifyContent:'center',  alignItems: 'center' }}
    >
      <Snackbar
        open={error.state || data}
        message={error.message || data}
        onClose={() => dispatch({ type: 'NONE' })}
        autoHideDuration={5000}
      >

        <Alert severity={error.message ? 'error' : 'success'}>
          {data || error.message}
        </Alert>
      </Snackbar>
      <Box
        className="reg-container"
      >
        <Box>
          <Typography
            variant='h5'
            sx={{ mb: 1 }}
          >
            Sociala
          </Typography>
          <Typography>
            Hey, Welcome Back!
          </Typography>
          <img
            src={LoginAvatar}
          />
        </Box>
        <Box>
          <Typography>
            Login To Your Account
          </Typography>

          <Box className='input-container'>
            <InputLabel htmlFor='email'>Email:</InputLabel>
            <TextField
              fullWidth
              id='email'
              onChange={(e) => handleChange(e)}
              value={inputValues?.email}
              name='email'
              label='Input your email address'
            />
          </Box>
          <Box className='input-container'>
            <InputLabel htmlFor='password'>password:</InputLabel>
            <TextField
              fullWidth
              id='password'
              name='password'
              value={inputValues?.password}
              type='password'
              onChange={(e) => handleChange(e)}
              label='Input your password'
            />
          </Box>
          <Box className='input-container'>
            {
              loading ? (
                <LoadingButton
                  loadingPosition='center'
                  variant='contained'
                  sx={{ p: 2 }}
                  loading
                >

                </LoadingButton>
              ) : (
                <Button
                  sx={{ textTransform: 'capitalize' }}
                  variant='outlined'
                  onClick={handleSubmit}
                >
                  sign in
                </Button>
              )
            }
          </Box>
          <Box>
            <Typography>
              Don&apos;t have an account yet? <Link to='/signup'>Create one</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login