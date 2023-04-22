import React, { useContext, useEffect, useState } from 'react'
import { serverLink } from '../utils/links.js'
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import { AppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Modal = ({ setGlobalSnackBarOpen, setGlobalSnackBarMsg }) => {
    let { isModalOpen, setIsModalOpen, currentUser } = useContext(AppData)
    const [postText, setPostText] = useState('')
    const [image, setImage] = useState(null)

    const navigate = useNavigate()
    const createPost = async () => {
        try {
            if (postText === '') {
                setGlobalSnackBarOpen(true)
                setGlobalSnackBarMsg('fill at least one input')
            } else {
                const res = await fetch(`${serverLink}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ post_content: { text: postText }, author: currentUser?._id })
                })

                const data = await res.json()
                setGlobalSnackBarOpen(true)
                setGlobalSnackBarMsg(data?.message)
                navigate('/')
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    const handleClose = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        console.log(postText);
    }, [postText])
    return (
        <div>
            <Dialog
                open={isModalOpen}
            >
                <DialogTitle>
                    Create new post
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in the inputs below to create a new post
                    </DialogContentText>
                    <TextField
                        autoFocus
                        multiline
                        fullWidth
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        variant='standard'
                        type='text'
                        margin='dense'
                        label='post content'
                        placeholder='this is a multiline text field'
                    />

                    <Button
                        variant='outlined'
                        sx={{
                            cursor: 'pointer',
                            margin: '10px auto'
                        }}
                    >
                        <label
                            style={{
                                cursor: 'pointer'
                            }}
                            htmlFor="profile">
                            add optional  pic
                        </label>
                    </Button>
                    <input
                        style={{
                            display: 'none'
                        }}
                        onChange={(e) => {
                            setInputValues(prev => {
                                return {
                                    ...prev,
                                    profile: e.target.files[0]
                                }
                            })
                        }}
                        name='profile'
                        id='profile'
                        type='file'
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleClose()}
                    >
                        cancel
                    </Button>
                    <Button
                        onClick={createPost}
                    >
                        Create post
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Modal