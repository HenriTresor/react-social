import React from 'react'
import { Container, Typography } from '@mui/material'
import { oops } from '../assets/imgLinks'

const Error = () => {
    return (
        <Container
            sx={{
                marginTop: 15,
                display: 'flex',
                flexDirection: 'column',
                textAlign: "center",
                alignItems: 'center'
            }}
        >
            <img src={oops}
                width="300"
            />
            <Typography
                variant='h4'
                sx={{
                    color: 'grey'
                }}
            >

                Something went wrong
            </Typography>
            <Typography
                variant='body1'
                sx={{
                    color: 'grey',
                    marginTop:5
                }}
            >

                try refreshing the page
            </Typography>

        </Container>
    )
}

export default Error