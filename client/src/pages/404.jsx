import { Container, Typography } from '@mui/material'
import React from 'react'
import { oops } from '../assets/imgLinks'

const NotFound = () => {
    return (
        <Container
            sx={{
                marginTop: 12,
                textAlign: 'center',
                minHeight: '100dvh',
                placeContent: 'center',
                display:'grid'
                
            }}
        >

            <img src={oops} />
            <Typography
                sx={{
                    color:'grey'
                }}
            variant='h3'
            >
                Page Not found
            </Typography>
        </Container>
    )
}

export default NotFound