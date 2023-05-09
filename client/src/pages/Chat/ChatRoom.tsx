import React, { useState, useEffect, useReducer } from 'react'
import './ChatRoom.css'
import {
    Box, Typography, Avatar, TextField, Button, Badge,
    IconButton
} from '@mui/material'


import {
    SendRounded, Menu, MenuOpen
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import Contact from '../../components/Contact/Contact'
import { author } from '../../components/Post/Post'
import { action, state } from '../Login/Login'
import axios from 'axios'
import { rootLink } from '../../utils/links'
import { options } from '../../hooks/useDateFormatter'
import addNotification from 'react-push-notification'

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
const ChatRoom = ({ socket }) => {

    // const [activeClass, setActiveClass] = useState(false)
    const scrollRef = React.useRef(null)
    const [messages, setMessages] = useState([])
    const [{ sending, sendingErr }, msgDispatch] = useReducer<any>(msgReducer, {
        sending: false,
        error: false
    })

    const [message, setMessage] = useState<string>('')
    const { user } = useSelector(state => state.auth)
    const { onlineUsers } = useSelector(state => state.sockets)
    const [currentChat, setCurrentChat] = useState<author | null>(user?.friends[0])

    useEffect(() => {
        const chatElement = scrollRef.current
        chatElement?.scrollTo(0, scrollRef.current?.scrollHeight)
    }, [messages]);

    useEffect(() => {
        console.log(currentChat);

    }, [currentChat])


    async function getMessages() {
        try {
            const res = await axios.post(`${rootLink}/api/messages`, { users: [user?._id, currentChat?._id] })
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: user?._id, receiver: currentChat?._id, message })
            })
            // console.log('clicked');
            const data = await res.json()
            // console.log(data);

            msgDispatch({ type: 'SENT' })
            const msg = {
                message: { text: message },
                users: [user, currentChat],
                receiver: currentChat,
                sender: user,
                createdAt: new Date(Date.now())
            }
            setMessage('')
            setMessages(prev => {
                return [...prev, msg]
            })

            if (socket?.current) {
                socket.current.emit('add message', msg)
            }

        } catch (error) {
            console.log(error);

            msgDispatch({ type: 'SENDING_ERROR' })
        }
    }


    useEffect(() => {
        if (socket?.current) {
            socket.current.on('new message', msg => {
                setMessages(prev => {
                    return [...prev, msg]
                })

                addNotification({
                    title: 'new message',
                    subtitle: `${msg?.sender?.names} messaged you`,
                    theme: 'darkblue',
                    message: msg?.message?.text.slice(0, 100),
                    native: true
                })
            })
        }
    }, [socket])

    const keyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            sendMsg()
        }
    }
    return (
        <Box
            className='body-container'
        >
            {/* <div className="hamburger">
                <IconButton
                    
                ><Menu /></IconButton>
            </div> */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 0.2,
                width: '50%'

            }}
                className='left-panel'
            >
                <Box sx={{ width: '100%' }}>
                    <Typography>
                        Online contacts
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        overflowX: 'auto',
                        gap: 2, p: .1, mt: 1,
                        float: 'left'
                    }}>
                        {
                            !onlineUsers && 'loading'
                        }
                        {


                            user?.friends?.map((friend) => {

                                return onlineUsers?.find(user => friend?._id === user?._id) ? (
                                    <Box onClick={() => setCurrentChat(friend)} sx={{ display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center' }}>
                                        <Badge
                                            variant='dot'
                                            color='success'

                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <Avatar
                                                src={friend.profile}
                                            />
                                        </Badge>
                                        <Typography>
                                            {friend?.names?.split(' ')[0].slice(0, 5)} ...
                                        </Typography>
                                    </Box>
                                ) : null
                            })
                        }


                    </Box>
                </Box>
                <Box sx={{ overflowY: 'auto', height: '100%', mt: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                        <Typography>
                            All contacts
                        </Typography>
                        <Button variant='contained'>+</Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            user?.friends?.map(friend => {
                                return (
                                    <Badge
                                        color={onlineUsers?.find(user => user?._id === friend?._id) ? 'success' : 'default'}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: '',
                                        }}
                                        variant='dot'>
                                        <div style={{ width: '100%' }} onClick={() => setCurrentChat(friend)}>
                                            <Contact {...friend}
                                                key={friend?._id}
                                            />
                                        </div>
                                    </Badge>
                                )
                            })
                        }
                    </Box>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 0.7, display: 'flex', width: '100%', flexDirection: 'column', ml: 1, mr: 1, boxShadow: '0px 0px 30px rgb(0,0,0,.1)', background: 'white', minHeight: '78dvh' }}>
                {
                    currentChat ? (
                        <>
                            <Box
                                sx={{ p: 1, display: 'flex', borderBottom: '1px solid', alignItems: 'center', gap: 2 }}
                            >
                                <Avatar
                                    src={currentChat?.profile}
                                />

                                <Box>
                                    <Typography>
                                        {currentChat && currentChat?.names}
                                    </Typography>
                                    <Typography variant='body2'>
                                        {onlineUsers?.find(user => user?._id === currentChat?._id) ? 'active' : 'away'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{ flexGrow: 1, p: 1, height: '10dvh' }}

                            >
                                {
                                    currentChat && (
                                        <Box
                                            className='chat-body'
                                            ref={scrollRef}
                                        >

                                            {
                                                messages?.map(message => {
                                                    return (
                                                        <Box className={message?.sender?._id === user?._id ? 'message receiver' : 'message sender'}>
                                                            <Typography
                                                                variant='body2'
                                                                color='grey'
                                                            >
                                                                {message?.sender?.names === user?.names ? 'you' : message?.sender?.names}
                                                            </Typography>
                                                            <Box className='text'>
                                                                {message?.message?.text}
                                                            </Box>
                                                            <Typography
                                                                variant='body2'
                                                                color='grey'
                                                            >
                                                                {new Date(message?.createdAt).toLocaleString('en-US', options)}
                                                            </Typography>
                                                        </Box>
                                                    )
                                                })
                                            }

                                        </Box>
                                    )
                                }
                            </Box>
                            <Box sx={{ p: 1, display: 'flex', gap: 2 }}>
                                <TextField
                                    onKeyDown={keyDown}

                                    fullWidth
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={` hi, ${currentChat?.names}!`}
                                />
                                <Button variant='contained'
                                    disabled={!message || sending}
                                    onClick={sendMsg}
                                >
                                    <SendRounded />
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box
                            sx={{ display: 'grid', placeContent: 'center', height: '100%', textAlign: 'center' }}
                        >
                            <Typography>
                                Hey, {user?.names},
                            </Typography>
                            <Typography>
                                Select a chat to start !
                            </Typography>
                        </Box>
                    )
                }
            </Box>

        </Box>
    )
}

export default ChatRoom