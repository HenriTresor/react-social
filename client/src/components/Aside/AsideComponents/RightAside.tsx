import React from 'react'
import { useSelector } from 'react-redux'
import {
    Button,
    Box,
    Typography, Avatar, IconButton
} from '@mui/material'
import Contact from '../../Contact/Contact'
import { author } from '../../Post/Post'
import Loading from '../../Loading/Loading'
import { Link } from 'react-router-dom'
import { Add } from '@mui/icons-material'
import { confirmRequest, sendFriendRequest } from '../../../utils/functions'

const RightAside = ({ allUsers }) => {
    // console.log('all users', allUsers);

    const { user, isLoading } = useSelector((state) => state.auth)

    const handleFriendRequest = async (requestId) => {
        const res = await sendFriendRequest(user?._id, requestId)
        if (res.status) {
            allUsers = allUsers.filter(user => user._id !== requestId)
        }
    }

    const handleAcceptRequest = async (requesterId) => {
        const res = await confirmRequest(user?._id, requesterId)
        if (res.status) {
            allUsers = allUsers.filter(user => user._id !== requesterId)
        }
    }
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
                                        <>
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
                                                </Box>
                                            </Link>
                                            <Box sx={{ display: 'flex', mt: 3, justifyContent: 'space-around' }}>
                                                <Button
                                                    onClick={()=>handleAcceptRequest(request?._id)}
                                                    variant='contained'>confirm</Button>
                                                <Button>delete</Button>
                                            </Box>
                                        </>
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
                            for (let i = 0; i < user?.sentRequests?.length; i++) {
                                if (user?.sentRequests[i]._id === newUser?._id) return
                            }
                            return (
                                <>
                                    <Link to={`/profile/${newUser?._id}`}>
                                        <Contact  {...newUser} key={newUser?._id} />
                                    </Link>
                                    <Button
                                        disabled={newUser?.friendRequests?.find(request => request?._id === user?._id)}
                                        onClick={() => handleFriendRequest(newUser?._id)}
                                        variant='contained'
                                    >add friend</Button>
                                </>
                            )
                        }) : <Loading />
                    }
                </Box>

            </Box>
        </>
    )
}

export default RightAside