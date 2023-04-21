import React from 'react'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { LogoutRounded } from '@mui/icons-material'
import { AppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Settings = () => {

    const navigate = useNavigate()
    const { setIsLoggedIn, setCurrentUser } = React.useContext(AppData)

    const handleLogout = () => {
        setIsLoggedIn(false)
        setCurrentUser(null)
        localStorage.removeItem('access_token')
        navigate('/login')
    }
    return (
        <Container
            sx={{
                marginTop: 12,
                textAlign: 'center'
            }}
        >

            <Typography component='h1' variant='h4'>
                Settings
            </Typography>

            <Paper>
                <Box
                    className='setting-box'
                >
                    <Typography>
                        Logout
                    </Typography>
                    <Button
                    onClick={handleLogout}
                        variant='contained' color='warning'>
                        <LogoutRounded />
                    </Button>
                </Box>
            </Paper>
        </Container >
    )
}

export default Settings