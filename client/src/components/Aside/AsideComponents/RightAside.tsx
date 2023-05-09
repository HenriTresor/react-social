import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { addRequest, confirmRequest as cr } from '../../../redux/AuthSlice'

const RightAside = ({ allUsers }) => {
    // console.log('all users', allUsers);

    const { user, isLoading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()


    const handleFriendRequest = async (request) => {
        const res = await sendFriendRequest(user?._id, request?._id)
        if (res.status) {
            dispatch(addRequest({ user: request }))
        }
    }
    2
    const handleAcceptRequest = async (requesterId) => {
        const res = await confirmRequest(user?._id, requesterId)
        return res.status
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
                                            <Box
                                                sx={{ background: 'white', p: 1, mt: 1, width: '100%' }}
                                            >
                                                <Link to={`/profile/${request?._id}`}>
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
                                                </Link>
                                                <Box sx={{ display: 'flex', mt: 3, justifyContent: 'space-around' }}>
                                                    <Button
                                                        onClick={() => handleAcceptRequest(request?._id)}
                                                        variant='contained'>confirm</Button>
                                                    <Button>delete</Button>
                                                </Box>
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
                                <Box sx={{ mt: 2 }}>
                                    <Link to={`/profile/${newUser?._id}`}>
                                        <Contact  {...newUser} key={newUser?._id} />
                                    </Link>
                                    {
                                        user?.friendRequests?.find(request => request?._id === newUser?._id) ? (
                                            <Button
                                                // disabled={}
                                                onClick={() => handleAcceptRequest(newUser)}
                                                variant='contained'
                                            >
                                               accept request
                                            </Button>
                                        ) : (
                                            <Button
                                                // disabled={handleFriendRequest}
                                                onClick={() => handleFriendRequest(newUser)}
                                                variant='outlined'
                                            >
                                                    {
                                                        console.log(user.sentRequests)
                                                        // user?.sentRequests?.find(request=> request?._id === newUser?._id) ? 'sent' :'send friend request'
                                               }
                                            </Button>
                                        )
                                    }

                                </Box>
                            )
                        }) : <Loading />
                    }
                </Box>

            </Box>
        </>
    )
}

export default RightAside