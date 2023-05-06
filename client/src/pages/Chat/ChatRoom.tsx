import React, { useState, useEffect, useReducer } from 'react'
import './ChatRoom.css'
import {
    Box, Typography, Avatar, TextField, Button
} from '@mui/material'

import {
    SendRounded
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import Contact from '../../components/Contact/Contact'
import { author } from '../../components/Post/Post'
import { action, state } from '../Login/Login'
import axios from 'axios'
import { rootLink } from '../../utils/links'

const msgReducer = (state, action) => {

    switch (action.type) {
        case 'SENDING':
            return { ...state, sending: true }
        case 'SENT':
            return { ...state, sending: false }
        case 'SENDING_ERROR':
            return { ...state, sending: false }

        default:
            return state
    }
}
const ChatRoom = () => {

    const [messages, setMessages] = useState([])
    const [{ sending, sendingErr }, msgDispatch] = useReducer<any>(msgReducer, {
        sending: false,
        error: false
    })

    const [message, setMessage] = useState<string>('')
    const { user } = useSelector(state => state.auth)
    const [currentChat, setCurrentChat] = useState<author | null>(user?.friends[0])


    useEffect(() => {
        console.log(currentChat);

    }, [currentChat])


    async function getMessages() {
        try {
            const res = await axios.post(`${rootLink}/api/messages`, { users: [user?._di, currentChat?._id] })
            console.log(res);
            setMessages(res.data?.messages)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMessages()
    }, [currentChat])

    const sendMsg = async () => {
        
        msgDispatch({ type: 'SENDING' })
        try {
            
            const res = await fetch(`${rootLink}/api/messages/addmsg`, {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: user?._id, receiver: currentChat?._id, message: { text: message } })
            })
            console.log('clicked');
            const data = await res.json()
            console.log(data);
            setMessages(prev => {
                return [...prev, { message: { text: message }, users: [user?._id, currentChat?._id], sender: user?._id }]
            })
        } catch (error) {
            console.log(error);
            
            msgDispatch({ type: 'SENDING_ERROR' })
        }
    }
    return (
        <Box
            className='body-container'
        >
            <Box sx={{ minHeight: '78dvh' }}>
                <Typography>
                    Online contacts
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 0.7, display: 'flex', flexDirection: 'column', ml: 1, mr: 1, boxShadow: '0px 0px 30px rgb(0,0,0,.1)', background: 'white', minHeight: '78dvh' }}>
                <Box
                    sx={{ p: 1, display: 'flex', borderBottom: '1px solid', alignItems: 'center', gap: 2 }}
                >
                    <Avatar
                    />

                    <Typography>
                        {currentChat && currentChat?.names}
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, p: 1, height: '10dvh' }} className='chat-body'>
                    {
                        currentChat && (
                            <Box>
                                <Box className='message sender'>
                                    <Typography
                                        variant='body2'
                                        color='grey'
                                    >
                                        sender
                                    </Typography>

                                    <Box className='text'>
                                        Test message- sender
                                    </Box>
                                    <Typography
                                        variant='body2'
                                        color='grey'
                                    >
                                        time
                                    </Typography>
                                </Box>
                                <Box
                                    className='message receiver'
                                >

                                    <Typography
                                        variant='body2'
                                        color='grey'
                                    >
                                        receiver
                                    </Typography>

                                    <Box className='text'>
                                        Test message- receiver
                                    </Box>
                                    <Typography
                                        variant='body2'
                                        color='grey'
                                    >
                                        time
                                    </Typography>
                                </Box>
                            </Box>
                        )
                    }
                </Box>
                <Box sx={{ p: 1, display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={` hi, ${currentChat?.names}!`}
                    />
                    <Button variant='contained'
                        onClick={sendMsg}
                    >
                        <SendRounded />
                    </Button>
                </Box>
            </Box>
            <Box sx={{ minHeight: '78dvh' }}>
                <Typography>
                    All contacts
                </Typography>

                {
                    user?.friends?.map(friend => {
                        return <div onClick={() => setCurrentChat(friend)}>
                            <Contact {...friend}
                                key={friend?._id}
                            />
                        </div>
                    })
                }
            </Box>
        </Box>
    )
}

export default ChatRoom