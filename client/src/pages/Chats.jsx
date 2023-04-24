import { Box, Grid, Drawer, Stack, Typography, Snackbar, Paper, Container, Button, TextField, Avatar } from '@mui/material'
import React, { useContext, useEffect, useState, useRef, useReducer } from 'react'
import { AppData } from '../context/AppContext'
import { LogoutRounded, SendRounded, ArrowBack, PeopleAltRounded, ContactPage } from '@mui/icons-material'
import { serverLink } from '../utils/links'
import { hiAvatar } from '../assets/imgLinks'
import Loading from '../components/Loading'

const Chats = ({ socket, setGlobalSnackBarOpen, setGlobalSnackBarMsg }) => {
    const { currentUser, pageWidth } = useContext(AppData)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentChat, setCurrentChat] = useState(null)
    const [message, setMessage] = useState('')
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const [snackBarMsg, setSnackBarMsg] = useState('')
    const [messages, setMessages] = useState([])
    const scrollRef = useRef()
    const inputRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isErr, setIsErr] = useState(false)

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
            setIsSnackBarOpen(true)
            setSnackBarMsg('sending message ...')
            const res = await fetch(`${serverLink}/messages/addmsg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, sender: currentUser?._id, receiver: currentChat?._id })
            })

            const data = await res.json()
            setSnackBarMsg('message sent!')
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
            inputRef.current?.focus()
            socket.current.emit('add message', newMsg)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('new message', (message) => {
                setGlobalSnackBarOpen(true)
                setGlobalSnackBarMsg(`${message?.sender?.names} messaged you !`)
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
            setIsLoading(true)
            setIsSnackBarOpen(true)
            setSnackBarMsg('loading messages ...')
            const res = await fetch(`${serverLink}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users: [currentUser?._id, currentChat?._id] })
            })

            const data = await res.json()
            setIsLoading(false)
            setMessages(data?.messages)
            setIsSnackBarOpen(false)
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
                        currentUser?.friends?.length === 0 && (
                            <>

                                <Typography>
                                    Find friends
                                </Typography>
                            </>
                        )
                    }
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
                                        <Avatar
                                            sx={{
                                                width: '50px',
                                                height: '50px',
                                                marginRight: 1
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
                        direction={pageWidth > 600 ? 'row' : 'column'}
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
                                                        <Avatar
                                                            sx={{
                                                                width: '50px',
                                                                height: '50px',
                                                                marginRight: 3
                                                            }}
                                                            className='profile-image'

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
                                                    {isLoading && <Loading />}

                                                    {messages?.length === 0 &&
                                                        (
                                                            <Box
                                                                sx={{
                                                                    display: 'grid',
                                                                    placeContent: 'center',
                                                                    minHeight: '100%',
                                                                    textAlign: 'center',
                                                                    gap: 3,
                                                                    wordBreak: 'break-word'
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontFamily: 'verdana'
                                                                    }}
                                                                >
                                                                    This is the start of your lengendary conversation with {currentChat?.names}
                                                                </Typography>
                                                                <Typography
                                                                    variant='h4'
                                                                    sx={{
                                                                        fontFamily: 'cursive'
                                                                    }}
                                                                >
                                                                    Try Hi!
                                                                </Typography>
                                                            </Box>
                                                        )
                                                    }
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
                                                        inputRef={inputRef}
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
                                        )

                                        : (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    placeContent: 'center',
                                                    height: '100%',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <img src={hiAvatar} />
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