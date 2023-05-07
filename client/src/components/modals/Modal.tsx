import React from 'react'
import {Button} from '@mui/material'

const Modal = ({ children, modalRef }) => {
    return (
        <dialog
            open={false}
            className='modal'
        ref={modalRef}
        >
            {children}

            <Button
            onClick={()=>modalRef.current?.close()}
            >close</Button>
        </dialog>
    )
}

export default Modal