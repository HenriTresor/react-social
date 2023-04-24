import React, { useContext, useEffect, useReducer, useState } from 'react'
import { AppData } from '../context/AppContext'
import { Container, Box, Paper, Avatar, Typography, Stack, Button, Divider } from '@mui/material'
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom'
import { serverLink } from '../utils/links'
import Loading from '../components/Loading'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...state, loading: true }
            break;
        case 'FETCHED':
            return { ...state, loading: false, user: action.payload }
            break;
        case 'ERROR':
            return { ...state, loading: false, error: true }
            break;
        default:
            return state
    }
}

const Profile = () => {

    let { currentUser, pages } = useContext(AppData)
    const navigate = useNavigate()
    const [{ user, loading, error }, dispatch] = useReducer(reducer, {
        user: {},
        loading: true,
        error:false
    })

    const { id } = useParams()
    const [currentTab, setCurrentTab] = useState(1)
    const [userPosts, setUserPosts] = useState([])
    const [userLikedPages, setUserLikedPages] = useState([])

    const getUser = async () => {
        try {
            dispatch({type:'FETCHING'})
            const res = await fetch(`${serverLink}/users/${id}`, {
                method: 'GET'
            })

            const data = await res.json()
            dispatch({type:'FETCHED', payload:data?.user})
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    const getUserPosts = async () => {
        try {
            const res = await fetch(`${serverLink}/posts/user/${user?._id}`, {
                method: 'GET'
            })

            const data = await res.json()
            console.log(data);
            setUserPosts(data?.userPosts)
        } catch (err) {
            console.log(`error with ${state}`, err.message);
        }
    }

    useEffect(() => {
        setUserLikedPages(pages?.filter(page => page?.page_followers?.includes(user?._id)))
    }, [pages, user])

    useEffect(() => {
        getUserPosts()
    }, [user])
    return (

        <>
            <Container
                sx={{ marginTop: 15, textAlign: 'center' }}
                className='container'>

                {
                    loading && <Loading />
                }
                <Box>
                    <Paper
                        elevation={4}
                        sx={{
                            padding: 3,
                            placeContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignContent: 'center',
                                alignItems: 'center'
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: '150px',
                                    height: '150px'
                                }}
                                className='profile-image'
                                src={user?.profile} alt={`${user?.names} profile picture`} />
                            <Typography
                                variant='h4'
                                component='h1'
                                sx={{
                                    marginTop: 3
                                }}
                            >
                                {user?.names}
                            </Typography>
                            <Typography>
                                {user?.email}
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                color='success'
                                sx={{
                                marginTop:3
                            }}
                            >
                                edit profile
                            </Button>
                        </Box>
                        <Stack
                            sx={{
                                display: 'grid',
                                marginTop: 3
                            }}
                            direction={'row'}
                            position={'center'}
                            spacing={2}
                            divider={<Divider orientation='vertical' flexItem />}
                        >
                            <Box>
                                <Button
                                    onClick={() => setCurrentTab(1)}
                                >
                                    Friends
                                </Button>
                                <Button
                                    onClick={() => setCurrentTab(2)}
                                >
                                    {user?._id === currentUser?._id ? 'your content' : `${user?.names?.split(' ')[0]}'contents`}
                                </Button>
                                <Button
                                    onClick={() => setCurrentTab(3)}
                                >
                                    pages liked
                                </Button>
                            </Box>
                        </Stack>

                        <Stack
                            sx={{
                                display: 'grid',
                                marginTop: 3
                            }}
                            direction={'row'}
                            position={'center'}
                            spacing={2}
                            divider={<Divider orientation='vertical' flexItem />}
                        >
                            {
                                currentTab === 1 ? (
                                    <Box>
                                        {
                                            user?.friends?.map(friend => {
                                                return (
                                                   
                                                    <Paper
                                                        onClick={() => {
                                                            navigate(`/profile/${friend?._id}`)
                                                            location.reload()
                                                        }}
                                                            key={friend._id}
                                                            elevation={6}
                                                        sx={{
                                                                cursor:'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                marginBottom: 2,
                                                                padding: 1
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    gap: 3
                                                                }}
                                                            >
                                                                <Avatar sx={{
                                                                    width: '100px',
                                                                    height: '100px'
                                                                }}
                                                                    src={friend?.profile} alt={`${friend?.names} profile pic`} />
                                                                <Typography>
                                                                    {friend?.names}
                                                                </Typography>
                                                            </Box>
                                                        {
                                                            currentUser?._id === user?._id && (
                                                                <Button
                                                                    color='warning'
                                                                    variant='outlined'
                                                                >

                                                                    unfriend
                                                                </Button>
                                                            )
                                                            }
                                                        </Paper>
                                                    
                                                )
                                            })
                                        }
                                    </Box>
                                ) : currentTab === 2 ? (
                                    (
                                        userPosts?.map((post) => {
                                            return (
                                                <Paper key={post._id}
                                                    elevation={6}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginBottom: 2,
                                                        padding: 1
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >

                                                        <Typography>
                                                            {post?.post_content?.text}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Link
                                                            to={`/posts/${post?._id}`}
                                                        >
                                                            <Button
                                                                color='primary'
                                                                variant='outlined'
                                                            >
                                                                visit
                                                            </Button>
                                                        </Link>
                                                        {
                                                            user?._id === currentUser?._id && (
                                                                <Button
                                                                    color='warning'
                                                                >
                                                                    delete
                                                                </Button>
                                                            )
                                                       }
                                                    </Box>
                                                </Paper>
                                            )
                                        })
                                    )
                                ) : (
                                    userLikedPages?.map((page) => {
                                        return (
                                            <Paper key={page?._id}
                                                sx={{
                                                    display: 'flex',
                                                    padding: 1,
                                                    justifyContent: 'space-between'

                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Typography>
                                                        {page?.page_name}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Button
                                                        color='primary'
                                                        variant='outlined'
                                                    >

                                                        Visit
                                                    </Button>
                                                    {
                                                        currentUser?._id === user?._id && (
                                                            <Button
                                                                color='warning'
                                                                variant='outlined'
                                                            >

                                                                unfollow
                                                            </Button>
                                                        )
                                                    }
                                               </Box>
                                            </Paper>
                                        )
                                    })
                                )
                            }
                        </Stack>
                    </Paper>
                </Box>
            </Container>
            <Outlet />
        </>

    )
}

export default Profile