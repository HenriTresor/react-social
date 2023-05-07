import React from 'react'
import { useSelector } from 'react-redux'
import {
    Button,
    Box,
    Typography, Avatar
} from '@mui/material'
import Contact from '../../Contact/Contact'
import { author } from '../../Post/Post'
import Loading from '../../Loading/Loading'
import { Link } from 'react-router-dom'

const RightAside = ({ allUsers }) => {
    console.log('all users', allUsers);

    const { user, isLoading } = useSelector((state) => state.auth)
    return (
        <>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>
                        Friend Requests ({user?.friendRequests?.length || 0})
                    </Typography>
                    <Button>
                        see all
                    </Button>

                </Box>
                {
                    isLoading ? <Loading /> : (
                        <>
                            {
                                user?.friendRequests?.map(request => {
                                    return (
                                        <Link to={`/profile/${request?._id}`}>
                                            <Box
                                                sx={{ background: 'white', p: 1, width: '100%' }}
                                            >
                                                <Box
                                                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                                                >
                                                    <Avatar
                                                        src={request?.profile}
                                                    />
                                                    <Typography>
                                                        {request?.names}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', mt: 3, justifyContent: 'space-around' }}>
                                                    <Button variant='contained'>confirm</Button>
                                                    <Button>delete</Button>
                                                </Box>
                                            </Box>
                                        </Link>
                                    )
                                })
                            }
                        </>

                    )
                }

                <Box
                    sx={{ mt: 4, background: 'white', p: 2 }}
                >
                    <Typography sx={{ mb: 2 }} variant='h6'>
                        Contacts
                    </Typography>

                    {
                        !isLoading ? user?.friends?.map((friend: author) => {

                            return (
                                <Link to={`/profile/${friend?._id}`}>
                                    <Contact {...friend} key={friend?._id} />
                                </Link>
                            )
                        }) : <Loading />
                    }
                </Box>
                <Box
                    sx={{ mt: 4, background: 'white', p: 2 }}
                >
                    <Typography sx={{ mb: 2 }} variant='h6'>
                        New People
                    </Typography>

                    {
                        !isLoading ? allUsers?.users?.map((newUser: author) => {

                            if (newUser?._id === user?._id) return null

                            for (let i = 0; i < user?.friends?.length; i++) {
                                if (user?.friends[i]._id === newUser?._id) return
                            }
                            return (
                                <Link to={`/profile/${newUser?._id}`}>
                                    <Contact {...newUser} key={newUser?._id} />
                                </Link>
                            )
                        }) : <Loading />
                    }
                </Box>

            </Box>
        </>
    )
}

export default RightAside