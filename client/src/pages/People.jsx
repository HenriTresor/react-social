import {
    Container,
    TextField,
    Button,
    Paper,
    Box,
    Avatar,
    Typography
} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { AppData } from '../context/AppContext'

const People = () => {
    const { pageWidth, currentUser, users } = useContext(AppData)

    const [newPeople, setNewPeople] = useState([])
    useEffect(() => {

    }, [users, currentUser])
    return (
        <Container
            sx={{
                marginTop: 12,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: pageWidth >= 1150 ? '55dvw' : '90%',
                    padding: 1,
                    marginBottom: 4
                }}
            >
                <Typography>
                    Friend Requests ({currentUser?.friendRequests?.length})
                </Typography>
                <Box>
                    {
                        currentUser?.friendRequests?.length === 0 ? (
                            <Box
                                sx={{
                                    padding: 1,
                                    display: 'grid',
                                    placeContent: 'center'
                                }}
                            >
                                <Typography>
                                    No Requests
                                </Typography>
                            </Box>
                        ) : (

                            currentUser?.friendRequests?.map(request => {
                                return (
                                    <Paper
                                        className='user-paper'
                                        key={request?._id}
                                        elevation={4}
                                    >
                                        <Avatar   sx={{
                                    width: '150px',
                                    height: '150px'
                                }} src={request?.profile} />
                                        <Typography>
                                            {request?.names}
                                        </Typography>
                                        <Typography>
                                            {request?.friends?.length > 1 ? request?.friends.length + ' friends' : request?.friends.length + ' friend'}
                                        </Typography>
                                        <Button variant='contained'
                                            onClick={(id) => acceptRequest(request?._id)}
                                        >
                                            accept request
                                        </Button>
                                    </Paper>
                                )
                            })

                        )
                    }
                </Box>
            </Paper>

            <Paper
                elevation={4}
                sx={{
                    width: pageWidth >= 1150 ? '55dvw' : '90%',
                    padding: 1,
                    marginBottom: 4
                }}
            >
                <Typography>
                    New people
                </Typography>

                <Box>
                    {

                        users?.map(person => {
                            if (person?._id === currentUser?._id) return null
                            for (let i = 0; i < currentUser?.friends?.length || i < currentUser?.sentRequests?.length; i++) {
                                if (person?._id === currentUser?.friends[i]?._id || person?._id === currentUser?.sentRequests[i]?._id) return null
                            }
                            return (
                                <Paper
                                    className='user-paper'
                                >
                                    <Avatar sx={{
                                        width: '150px',
                                        height: '150px'
                                    }} src={person?.profile} />
                                    <Typography>
                                        {person?.names}
                                    </Typography>
                                    <Typography>
                                        {person?.friends?.length > 1 ? person?.friends.length + ' friends' : person?.friends.length + ' friend'}
                                    </Typography>
                                    <Button variant='contained'
                                        onClick={(id) => acceptRequest(person?._id)}
                                    >
                                        Add friend
                                    </Button>
                                </Paper>
                            )
                        })
                    }
                </Box>
            </Paper>
        </Container>
    )
}

export default People