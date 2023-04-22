import { Container, Box, TextField, Select, Snackbar, MenuItem, FormControl, InputLabel, Grid, Button, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useReducer, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { serverLink } from '../utils/links'
import { useNavigate, Link, Outlet } from 'react-router-dom'
import axios from 'axios'

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
const Signup = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [{ loading, error, data }, dispatch] = useReducer(reducer, {
        loading: false,
        error: false,
        message: ''
    })

    const [inputValues, setInputValues] = useState({
        email: '',
        names: '',
        password: '',
        gender: '',
        profile: null
    })

    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [profileUrl, setProfileUrl] = useState('')

    const handleChange = (e) => {
        setInputValues(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const uploadPic = async () => {
        try {
            if (inputValues.profile !== null) {
                setIsImageUploaded(false)
                setIsImageUploading(true)
                const formData = new FormData()
                formData.append('file', inputValues.profile)
                formData.append('upload_preset', 'gpzxoihy')
                axios.post('https://api.cloudinary.com/v1_1/djehh7gum/image/upload', formData)
                    .then(res => {
                        setProfileUrl(res.data.secure_url)
                    }).then(() => {

                        setIsImageUploaded(true)
                    }).then(() => {
                        setIsImageUploading(false)
                    })

            }
        } catch (err) {
            console.log(err.message);
        }
    }
    const handleSubmit = async () => {
        try {

            if (!inputValues.email || !inputValues.names || !inputValues.password) {
                dispatch({ type: 'ERROR', payload: 'input all the fields marked required (*)' })
                setOpen(true)
            } else {
                setOpen(false)
                dispatch({ type: 'START_FETCHING' })

                let res
                res = await fetch(`${serverLink}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({ ...inputValues, profile: profileUrl })
                })

                const data = await res.json()
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
        console.log(inputValues);
    }, [inputValues])
    return (
        <>
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
                        Create a new account
                    </Typography>

                    <Box
                        sx={{
                            marginTop: 3
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ marginBottom: 3 }}
                                    fullWidth
                                    label={'enter your email address'}
                                    name='email'
                                    value={inputValues.email}
                                    id='email'
                                    required
                                    onChange={(e) => handleChange(e)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ marginBottom: 3 }}
                                    fullWidth
                                    label={'enter full names'}
                                    value={inputValues.names}
                                    required
                                    name='names'
                                    onChange={(e) => handleChange(e)}
                                    id='names'
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ marginBottom: 3 }}
                                    fullWidth
                                    label={'create password'}
                                    name='password'
                                    id='password'
                                    type='password'
                                    required
                                    value={inputValues.password}
                                    onChange={(e) => handleChange(e)}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl
                                    fullWidth
                                >
                                    <InputLabel>
                                        Choose your gender
                                    </InputLabel>
                                    <Select
                                        required
                                        name='gender'
                                        value={inputValues.gender}
                                        onChange={(e) => handleChange(e)}
                                        fullWidth
                                    >
                                        <MenuItem value='male'>Male</MenuItem>
                                        <MenuItem value='female'>Female</MenuItem>
                                        <MenuItem value='custom'>Custom</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button
                                    variant='contained'
                                    sx={{
                                        cursor: 'pointer',
                                        margin: '10px auto'
                                    }}
                                >
                                    <label
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        htmlFor="profile">
                                        add optional profile pic
                                    </label>
                                </Button>
                                <input
                                    style={{
                                        display: 'none'
                                    }}
                                    onChange={(e) => {
                                        setInputValues(prev => {
                                            return {
                                                ...prev,
                                                profile: e.target.files[0]
                                            }
                                        })
                                    }}
                                    name='profile'
                                    id='profile'
                                    type='file'
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 2
                        }}>

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
                                (inputValues.profile !== null && profileUrl !== null) && (
                                    <Button
                                        onClick={uploadPic}
                                        disabled={isImageUploaded}
                                    >{!isImageUploaded ? 'upload profile picture' : 'image uploaded!'}</Button>
                                )
                            }

                            {
                                !loading ? (
                                    <>
                                        <Button
                                            onClick={handleSubmit}
                                            variant='contained'
                                            color='warning'
                                            disabled={isImageUploading}
                                        >
                                            create account
                                        </Button>
                                    </>
                                ) : (
                                    <LoadingButton
                                            loading
                                            loadingIndicator='Creating account !'
                                            variant='outlined'
                                    >

                                    </LoadingButton>
                                )
                            }

                        </Box>
                    </Box>
                    <Link to='/login'>
                        <Typography>
                            Already have an account ? Sign in!
                        </Typography>
                    </Link>
                </Box>
            </Container>

            <Outlet />
        </>
    )
}

export default Signup