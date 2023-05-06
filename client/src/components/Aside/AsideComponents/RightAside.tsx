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

const RightAside = () => {
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
                        <Box
                            sx={{ background: 'white', p: 1, width: '100%' }}
                        >
                            <Box
                                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                            >
                                <Avatar />
                                usernames
                            </Box>
                            <Box sx={{ display: 'flex', mt: 3, justifyContent: 'space-around' }}>
                                <Button variant='contained'>confirm</Button>
                                <Button>delete</Button>
                            </Box>
                        </Box>
                    )
               }

                <Box
                sx={{mt:4, background:'white', p:2}}
                >
                    <Typography  sx={{mb:2}} variant='h6'>
                        Contacts
                    </Typography>

                    {
                       !isLoading ?  user?.friends?.map((friend: author) => {

                            return (
                                <Contact {...friend} key={friend?._id} />
                            )
                        }) : <Loading />
                    }
                </Box>
                <Box
                sx={{mt:4, background:'white', p:2}}
                >
                    <Typography  sx={{mb:2}} variant='h6'>
                        New People
                    </Typography>

                    {
                       !isLoading ?  user?.friends?.map((friend: author) => {

                            return (
                                <Contact {...friend} key={friend?._id} />
                            )
                        }) : <Loading />
                    }
                </Box>
            </Box>
        </>
    )
}

export default RightAside