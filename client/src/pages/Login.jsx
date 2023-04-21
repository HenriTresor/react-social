import { Container, Box, TextField, Button, Snackbar, Checkbox, Typography } from '@mui/material'
import React, { useState, useReducer, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { serverLink } from '../utils/links'
import { LoadingButton } from '@mui/lab'


const reducer = (state, action) => {
    switch (action.type) {
        case 'START_FETCHING':
            return { ...state, loading: true }
            break;
        case 'FETCHED':
            return { ...state, data: action.payload }
            break;
        case 'ERROR':
            return { ...state, error: action.payload, loading: false }
    }
}
const Login = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [{ loading, error, data }, dispatch] = useReducer(reducer, {
        loading: false,
        error: false,
        message: ''
    })



    const [inputValues, setInputValues] = useState({
        email: '',
        password: '',
    })
    const handleChange = (e) => {
        setInputValues(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleSubmit = async () => {
        try {

            if (!inputValues.email || !inputValues.password) {
                dispatch({ type: 'ERROR', payload: 'input all the fields marked required (*)' })
                setOpen(true)
            } else {
                setOpen(false)
                dispatch({ type: 'START_FETCHING' })
                const res = await fetch(`${serverLink}/auth/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(inputValues)
                    })

                const data = await res.json()
                console.log(data);
                if (!data.status) {
                    setOpen(true)
                    dispatch({ type: 'ERROR', payload: data.message })
                } else {
                    dispatch({ type: 'FETCHED', payload: data })
                    localStorage.setItem('access_token', data.access_token)
                    location.assign('/')
                }

            }
        } catch (error) {
            setOpen(true)
            dispatch({ type: 'ERROR', payload: error.message })
        }
    }

    useEffect(() => {
        if (localStorage.getItem('access_token')) return navigate('/')
    }, [])
    return (
        <Container
            sx={{
                padding: 2,
                display: 'grid',
                placeContent: 'center',
                minHeight: '100dvh'
            }}
        >
            <Snackbar
                open={open}
                autoHideDuration={1}
                message={error}
            >

            </Snackbar>

            <Box
                sx={{
                    padding: 2,
                    boxShadow: '0px 0px 30px rgb(0,0,0, .3)',
                    borderRadius: 3
                }}
            >
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>

                <Box
                    sx={{
                        marginTop: 3
                    }}
                >
                    <TextField
                        sx={{ marginBottom: 3 }}
                        fullWidth
                        label={'email address'}
                        name='email'
                        onChange={(e) => handleChange(e)}
                        value={inputValues.email}
                        id='email'
                        required
                    />
                    <TextField
                        sx={{ marginBottom: 3 }}
                        fullWidth
                        label={'password'}
                        onChange={(e) => handleChange(e)}
                        value={inputValues.password}
                        name='password'
                        id='password'
                        required
                    />

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 2
                    }}>
                        <Checkbox

                        />
                        <Typography>
                            Remember me
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 2,
                            justifyContent: 'space-between',
                        }}
                    >
                        {
                            !loading ? (
                                <Button
                                    variant='contained'
                                    color='warning'
                                    onClick={handleSubmit}
                                >
                                    Sign in
                                </Button>
                            ) :
                                (
                                    <LoadingButton
                                        loading
                                        variant='outlined'
                                        color='warning'
                                    >
                                        submit
                                    </LoadingButton>
                                )
                        }

                        <Typography>
                            Forgot password?
                        </Typography>

                        <Link to='/signup'>
                            <Typography>
                                Don't Have an account? Create one!
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default Login