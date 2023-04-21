import { Box, Button } from '@mui/material'
import React from 'react'
import { CloseRounded } from '@mui/icons-material'

const MessageModal = () => {
    return (
        <Box
            className='modal'
        >
            <Button>
                <CloseRounded />
            </Button>
            Messages modal
        </Box>
    )
}

export default MessageModal