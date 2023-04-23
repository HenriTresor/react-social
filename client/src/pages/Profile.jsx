import React, { useContext, useEffect, useState } from 'react'
import { AppData } from '../context/AppContext'
import { Container, Box, Paper, Typography, Stack, Button, Divider } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { serverLink } from '../utils/links'
const Profile = () => {

    let { currentUser, pages } = useContext(AppData)
    const [currentTab, setCurrentTab] = useState(1)
    const [userPosts, setUserPosts] = useState([])
    const [userLikedPages, setUserLikedPages] = useState([])

    const getUserPosts = async () => {
        try {
            const res = await fetch(`${serverLink}/posts/user/${currentUser?._id}`, {
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
        setUserLikedPages(pages?.filter(page => page?.page_followers?.includes(currentUser?._id)))
    }, [pages])

    useEffect(() => {
        getUserPosts()
    },[])
    return (

        <>
            <Container
                sx={{ marginTop: 15, textAlign: 'center' }}
                className='container'>

                <Box>
                    <Paper
                        elevation={4}
                        sx={{
                            padding: 3
                        }}
                    >
                        <img
                            className='profile-image'
                            src={currentUser?.profile} alt={`${currentUser.names} profile picture`} />
                        <Typography
                            variant='h4'
                            component='h1'
                            sx={{
                                marginTop: 3
                            }}
                        >
                            {currentUser?.names}
                        </Typography>
                        <Typography>
                            {currentUser?.email}
                        </Typography>

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
                                    your contents
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
                                            currentUser?.friends?.map(friend => {
                                                return (
                                                    <Paper key={friend._id}
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
                                                            <img
                                                                className='profile-image'
                                                                src={friend?.profile} alt={`${friend?.names} profile pic`} />
                                                            <Typography>
                                                                {friend?.names}
                                                            </Typography>
                                                        </Box>
                                                        <Button
                                                            color='warning'
                                                            variant='outlined'
                                                        >

                                                            unfriend
                                                        </Button>
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
                                                            <Button>
                                                                <Button
                                                                    color='primary'
                                                                    variant='outlined'
                                                                >
                                                                    visit
                                                                </Button>

                                                            </Button>
                                                            <Button
                                                                color='warning'
                                                            >
                                                                delete
                                                            </Button>
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
                                                    justifyContent:'space-between'
                                                    
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
                                                <Button
                                                    color='warning'
                                                    variant='outlined'
                                                >

                                                    unfollow
                                                </Button>
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