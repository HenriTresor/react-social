import React from 'react'
import { Backdrop } from '@mui/material'
import { CircularProgress}from '@mui/material'


const Loading = () => {
    return (
        <Backdrop
            sx={{
                background:'white'
            }}
        open
        >
            <CircularProgress color='inherit'/>
        </Backdrop>
    )
}

export default Loading