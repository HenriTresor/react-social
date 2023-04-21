import { Box, Grid, Drawer, Stack, Typography, Snackbar, Paper, Container, Button, TextField } from '@mui/material'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppData } from '../context/AppContext'
import { LogoutRounded, SendRounded, ArrowBack, PeopleAltRounded, ContactPage } from '@mui/icons-material'
import { serverLink } from '../utils/links'

const Chats = ({ socket }) => {

    const { currentUser } = useContext(AppData)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentChat, setCurrentChat] = useState(null)
    const [message, setMessage] = useState('')
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const [snackBarMsg, setSnackBarMsg] = useState('')
    const [messages, setMessages] = useState([])
    const scrollRef = useRef()
    const [isScrolling, setIsScrolling] = useState(false)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight

        }
    }, [messages])

    const sendMessage = async () => {
        if (!message) {
            setIsSnackBarOpen(true)
            setSnackBarMsg('Message can\'t be null')
            return
        }
        try {
            setIsSnackBarOpen(false)
            const res = await fetch(`${serverLink}/messages/addmsg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, sender: currentUser?._id, receiver: currentChat?._id })
            })

            const data = await res.json()
            const newMsg = {
                message: {
                    text: message
                },
                sender: currentUser,
                receiver: currentChat,
                users: [currentUser, currentChat],
                createdAt: Date.now()
            }
            setMessages(prev => {
                return [
                    ...prev,
                    newMsg
                ]
            })

            setMessage('')
            socket.current.emit('add message', newMsg)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('new message', (message) => {
                setMessages(prev => {
                    return [
                        ...prev,
                        message
                    ]
                })
            })
        }
    }, [socket.current])


    const getMessages = async () => {
        try {
            const res = await fetch(`${serverLink}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users: [currentUser?._id, currentChat?._id] })
            })

            const data = await res.json()
            setMessages(data?.messages)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getMessages()
        console.log(messages);
    }, [currentChat])
    return (
        <Box
            sx={{
                marginTop: 12
            }}
            className='container'
        >
            <Snackbar
                open={isSnackBarOpen}
                message={snackBarMsg}
                autoHideDuration={5000}
                onClose={() => setIsSnackBarOpen(false)}
            >

            </Snackbar>
            <Drawer
                open={isDrawerOpen}
                anchor='left'
                variant='temporary'
            >
                <Box
                    sx={{
                        marginTop: 12
                    }}
                >
                    <Box>
                        <Button
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <ArrowBack />
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        padding: 2
                    }}
                >
                    {
                        currentUser?.friends?.map(friend => {
                            return (
                                <Paper
                                    onClick={() => {
                                        setCurrentChat(friend)
                                        setIsDrawerOpen(false)
                                    }}
                                    elevation={3}
                                    sx={{
                                        padding: 2,
                                        marginBottom: 2,
                                        cursor: 'pointer',
                                    }}
                                    key={friend?._id}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1em'
                                        }}
                                    >
                                        <img
                                            style={{
                                                width: '60x',
                                                height: '60px'
                                            }}
                                            src={friend?.profile}
                                            alt={`${friend?.names} profile pic`} />
                                        <Typography
                                            sx={{
                                                float: 'right'
                                            }}
                                        >
                                            {friend?.names}
                                        </Typography>
                                    </Box>
                                </Paper>
                            )
                        })
                    }
                </Box>
            </Drawer>

            <Box>
                <Box>
                    <Stack
                        direction='row'
                        spacing={3}
                    >

                        <Stack
                            direction='column'
                            spacing={2}
                        >
                            <Typography>
                                Hey, {currentUser?.names},
                            </Typography>
                            <Button
                                startIcon={<ContactPage />}
                                onClick={() => setIsDrawerOpen(true)}
                                variant='contained'
                            >
                                Contacts
                            </Button>
                            <Button
                                startIcon={<PeopleAltRounded />}
                                variant='contained'
                            >
                                find new contacts
                            </Button>
                        </Stack>

                        <Container
                            sx={{
                                display: 'flex',
                                justifyContent: 'end'
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    width: '100%',
                                    height: '80dvh',
                                    border: '2px solid grey',
                                    padding: 1,
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {
                                    currentChat !== null ?

                                        (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        border: '2px solid grey',
                                                        padding: 1,
                                                        borderRadius: 2
                                                    }}
                                                >

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <img
                                                            style={{
                                                                width: '60x',
                                                                height: '60px'
                                                            }}
                                                            src={currentChat?.profile}
                                                        />
                                                        <Typography>
                                                            {currentChat?.names}
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        startIcon={<LogoutRounded />}
                                                    >
                                                        logout
                                                    </Button>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        padding: 1,
                                                        flexGrow: 1,
                                                        border: '2px solid grey',
                                                        marginTop: 1,
                                                        overflowY: 'auto',

                                                    }}

                                                    ref={scrollRef}
                                                >

                                                    {
                                                        messages?.map(message => {
                                                            return (
                                                                <Box
                                                                    className={message?.sender?._id === currentUser?._id ? 'message-body receiver' : 'message-body sender'}
                                                                >
                                                                    <Typography
                                                                        component='p'
                                                                        variant='body2'
                                                                    >



                                                                        {message?.sender?._id === currentUser?._id ? 'You' : message?.sender?.names}
                                                                    </Typography>
                                                                    <Box
                                                                        className='message'
                                                                    >
                                                                        <Typography>
                                                                            {message?.message?.text}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography
                                                                        variant='body2'
                                                                    >
                                                                        {`${new Date(message?.createdAt).toLocaleDateString('default', { weekday: 'short' })}, ${new Date(message?.createdAt).getHours()}:${new Date(message?.createdAt).getMinutes()}`}
                                                                    </Typography>
                                                                </Box>
                                                            )
                                                        })
                                                    }

                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        marginTop: 2,
                                                        gap: '1em'
                                                    }}
                                                >
                                                    <TextField
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        fullWidth
                                                        placeholder={`Hey, ${currentChat?.names} ...`}
                                                    />
                                                    <Button
                                                        onClick={sendMessage}
                                                        variant='contained'
                                                    >
                                                        <SendRounded />
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    placeContent: 'center',
                                                    height: '100%'
                                                }}
                                            >
                                                <Typography>
                                                    Hey {currentUser?.names}, Select a chat to continue, ...!
                                                </Typography>
                                            </Box>
                                        )
                                }
                            </Box>
                        </Container>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default Chats