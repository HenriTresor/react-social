import { FC, useState, useReducer, useEffect } from 'react'
import {
    Container,
    Box, Button, TextField,
    Typography, Alert, Snackbar, InputLabel, FormControl, Select, MenuItem
} from '@mui/material'
import '../registeration/reg.css'
import LoginAvatar from '../../assets/login-avatar.png'
import axios from 'axios'
import { rootLink } from '../../utils/links.js'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/AuthSlice.js'
import { useNavigate, Link } from 'react-router-dom'
interface credentials {
    email?: string
    password?: string
    gender: string
    profile?: string
    names: string
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


const Signup = () => {
    const { isLoggedIn } = useSelector((state: object) => state.auth)
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
        password: '',
        gender: '',
        profile: '',
        names: ''
    })
    console.log(inputValues);

    const reduxDisptacher = useDispatch()

    const handleChange = (e: any) => {
        setInputValues((prev) => {
            return {
                ...prev,
                [e.target?.name]: e.target.value
            }
        })


    }

    const handleSubmit = async () => {
        dispatch({ type: 'LOGIN_START' })

        try {
            const res = await fetch(`${rootLink}/api/users`, {
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
            sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center' }}
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
                <Box
                    sx={{ display: 'grid', placeContent: 'center' }}
                >
                    <Typography
                        variant='h5'
                        sx={{ mb: 1 }}
                    >
                        Sociala
                    </Typography>
                    <Typography>
                        Hey, create your new Account!
                    </Typography>
                    <Typography
                        variant='body2'
                        sx={{ color: 'white', mt: 1 }}
                    >
                        Sociala is an online-based social media application. Start now!
                    </Typography>

                </Box>
                <Box>


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
                        <InputLabel htmlFor='names'>Full names:</InputLabel>
                        <TextField
                            fullWidth
                            id='names'
                            onChange={(e) => handleChange(e)}
                            value={inputValues?.names}
                            name='names'
                            label='Enter your full names'
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
                        <FormControl fullWidth>
                            <InputLabel htmlFor='gender'>gender</InputLabel>
                            <Select
                                label='gender'
                                id='gender'
                                name='gender'
                                onChange={(e) => handleChange(e)}
                                value={inputValues?.gender}

                            >
                                <MenuItem value={'male'}>
                                    Male
                                </MenuItem>
                                <MenuItem value={'female'}>
                                    Female
                                </MenuItem>
                            </Select>
                        </FormControl>
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
                                    create account
                                </Button>
                            )
                        }
                    </Box>
                    <Box>
                        <Typography>
                            Don&apos;t have an account yet? <Link to='/login'>Create one</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default Signup