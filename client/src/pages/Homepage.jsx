import { Box, Grid, List, Button, ListItem, Paper, Typography, Snackbar, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material'
import React, { useEffect, useContext, useReducer, useState } from 'react'
import Header from '../components/layout/Header'
import Body from '../components/layout/Body'
import Aside from '../components/layout/Aside'
import { PagesOutlined, Newspaper, GroupOutlined, Group } from '@mui/icons-material'
import { AppData } from '../context/AppContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { serverLink } from '../utils/links'
import { useNavigate, Outlet } from 'react-router-dom'

const reducer = (state, action) => {
    switch (action.type) {
        case 'START_FETCHING':
            return { ...state, loading: true }
            break;
        case 'FETCHED':
            return { ...state, done: true, requestedData: action.payload }
            break;
        case 'ERROR':
            return { ...state, error: action.payload, loading: false }
    }
}

const HomePage = () => {
    const [open, setOpen] = useState(false)
    const [{ loading, error, requestData, done, payload }, dispatch] = useReducer(reducer, {
        loading: false,
        error: false,
        message: ''
    })
    const navigate = useNavigate()
    let { users, setUsers, pages, setPages, currentUser } = useContext(AppData)
    console.log(currentUser);
    const { isLoading, isError, data } = useQuery({
        queryKey: ['users'],
        queryFn: async function () {
            const usersRes = await axios.get(`${serverLink}/users?currentUserId=${currentUser?._id}`)
            const pageRes = await axios.get(`${serverLink}/pages`)

            return {
                usersRes,
                pageRes
            }
        }
    })

    useEffect(() => {
        setUsers(data?.usersRes?.data?.users)
        setPages(data?.pageRes?.data?.pages)
    }, [data])


    const sendRequest = async (id) => {
        try {
            dispatch({ type: 'START_FETCHING' })
            const res = await fetch(`${serverLink}/friends/${currentUser?._id}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ requestId: id })
            })

            const data = await res.json()
            if (!data.status) {
                setOpen(true)
                dispatch({ type: 'ERROR', payload: data.message })
            } else {
                setOpen(true)
                dispatch({ type: 'FETCHED', payload: data.message })
            }
        } catch (error) {
            setOpen(true)
            dispatch({ type: 'ERROR', payload: error.message })
        }
    }
    const acceptRequest = async (id) => {
        try {
            dispatch({ type: 'START_FETCHING' })
            const res = await fetch(`${serverLink}/friends/${currentUser?._id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ requesterId: id })
            })

            const data = await res.json()
            if (!data.status) {
                setOpen(true)
                dispatch({ type: 'ERROR', payload: data.message })
            } else {
                setOpen(true)
                dispatch({ type: 'FETCHED', payload: data.message })
            }
        } catch (error) {
            setOpen(true)
            dispatch({ type: 'ERROR', payload: error.message })
        }
    }

    const followPage = async (id) => {
        try {
            dispatch({ type: 'START_FETCHING' })
            const res = await fetch(`${serverLink}/pages`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ follower: currentUser?._id, pageId: id })
            })

            const data = await res.json()
            if (!data.status) {
                setOpen(true)
                dispatch({ type: 'ERROR', payload: data.message })
            } else {
                setOpen(true)
                dispatch({ type: 'FETCHED', payload: data.message })
            }
        } catch (error) {
            setOpen(true)
            dispatch({ type: 'ERROR', payload: error.message })
        }
    }
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={1}
                message={error ? error : requestData}
            >

            </Snackbar>
            <Grid>
                <Grid item xs={12}
                >
                    <Header />
                </Grid>
                <Grid item xs={3}>
                    <Aside anchor='left'

                    >
                        <Box
                            sx={{
                                marginTop: 10,
                                padding: 2
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    placeContent: 'center'
                                }}
                            >
                                <Button variant='contained'>
                                    create a new post
                                </Button>
                            </Box>
                            <List>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Newspaper />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            news feed
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <PagesOutlined />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            explore pages
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <GroupOutlined />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            find friends
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </List>

                            <Box>
                                <Typography>
                                    page suggestions
                                </Typography>
                                {
                                    pages?.map(page => {
                                        return (
                                            <Paper className='user-paper'>
                                                <Box>
                                                    <Typography>
                                                        {page?.page_name}
                                                    </Typography>

                                                    <Typography>
                                                        {page?.page_followers.length > 1 ? page?.page_followers.length + ' followers' : page?.page_followers.length + ' follower'}
                                                    </Typography>
                                                </Box>
                                               
                                                {
                                                    page?.followers?.includes(currentUser) ? (
                                                    <h2>al</h2>
                                                    ) : (
                                                        <Button
                                                            onClick={(id) => followPage(page?._id)}
                                                            variant='contained'>
                                                            follow
                                                        </Button>
                                                    )
                                                }
                                            </Paper>
                                        )
                                    })
                                }
                            </Box>
                        </Box>
                    </Aside >
                </Grid>
                <Grid item xs={6} md={8} sx={{ marginTop: 9, textAlign: 'center' }}>
                    <Body />
                </Grid>
                <Grid item xs={3}>
                    <Aside anchor='right'>

                        <Box
                            sx={{
                                marginTop: 10,
                                padding: 2
                            }}
                        >
                            <Typography>
                                Friend Requests ({currentUser?.friendRequests?.length})
                            </Typography>

                            <Box>
                                {
                                    currentUser?.friendRequests?.length === 0 ? (
                                        <Typography>
                                            No Requests
                                        </Typography>
                                    ) : (
                                        currentUser?.friendRequests?.map(request => {
                                            console.log(request);
                                            return (
                                                <Paper key={request} className='user-paper'>
                                                    <img src={request?.profile} />
                                                    <Typography>
                                                        {request?.names}
                                                    </Typography>
                                                    <Typography>
                                                        {request?.friends?.length > 1 ? request?.friends.length + ' friends' : request?.friends.length + ' friend'}
                                                    </Typography>
                                                    <Button variant='contained'
                                                        onClick={(id) => acceptRequest(request?._id)}
                                                    >
                                                        accept request
                                                    </Button>
                                                </Paper>
                                            )
                                        })
                                    )
                                }
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                marginTop: 3,
                                padding: 2
                            }}
                        >
                            <h3>Friends suggestions</h3>

                            <Box>
                                {
                                    isLoading ? 'loading' : (
                                        users?.map(user => {
                                            if (user._id === currentUser?._id || currentUser?.friends?.includes(user?._id)) {
                                                return null
                                            }
                                            return (
                                                <Paper key={user?._id} className='user-paper'>
                                                    <img src={user?.profile} />
                                                    <Typography>
                                                        {user?.names}
                                                    </Typography>
                                                    <Typography>
                                                        {user?.friends?.length > 1 ? user?.friends.length + ' friends' : user?.friends.length + ' friend'}
                                                    </Typography>
                                                    {

                                                        done ? <Button disabled color='success' variant='contained'>
                                                            request sent
                                                        </Button> : (
                                                            <Button
                                                                onClick={(id) => sendRequest(user?._id)}
                                                                variant='outlined'>
                                                                send friend request
                                                            </Button>
                                                        )
                                                    }
                                                </Paper>
                                            )
                                        })
                                    )
                                }
                            </Box>
                        </Box>
                    </Aside >
                </Grid>
            </Grid >

            <Outlet />
        </>

    )
}

export default HomePage