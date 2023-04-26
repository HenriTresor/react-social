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
import { AppData } from '../context/AppContext.tsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LoadingButton } from '@mui/lab'

const Modal = ({ setGlobalSnackBarOpen, setGlobalSnackBarMsg }) => {
    let { isModalOpen, setIsModalOpen, currentUser } = useContext(AppData)
    const [postText, setPostText] = useState('')
    const [image, setImage] = useState(null)
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    useEffect(() => {
        console.log(image);
    }, [image])

    const navigate = useNavigate()

    const uploadImage = async () => {
        try {
            if (image) {
                setIsImageUploading(true)
                const formData = new FormData()
                formData.append('file', image)
                formData.append('upload_preset', 'gpzxoihy')
                axios.post('https://api.cloudinary.com/v1_1/djehh7gum/image/upload', formData)
                    .then(data => {
                        console.log(data);
                        setImageUrl(data?.data?.secure_url)
                    }).then(() => {
                        setIsImageUploading(false)
                    })
            }
        } catch (err) {
            console.log(err.message);
        }
    }
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
                    body: JSON.stringify({ post_content: { text: postText }, author: currentUser?._id, image: imageUrl })
                })

                const data = await res.json()
                setGlobalSnackBarOpen(true)
                setGlobalSnackBarMsg(data?.message)
                if (data.status) {

                    setImage(null)
                    setPostText('')
                    setImageUrl(null)
                    navigate(`/posts/${data?.post?._id}`)
                    setIsModalOpen(false)
                }

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
                        variant={image ? 'contained' : 'outlined'}
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
                            {image ? image?.name?.slice(0, 10) + '...' : 'add optional image'}
                        </label>
                    </Button>
                    {
                        image && (
                            isImageUploading ? (
                                <LoadingButton
                                    loading
                                />
                            ) : imageUrl ? (
                                <Button
                                    disabled
                                >
                                    uploaded
                                </Button>
                            ) : (
                                <Button
                                    onClick={uploadImage}
                                >
                                    upload
                                </Button>
                            )
                        )
                    }
                    <input
                        style={{
                            display: 'none'
                        }}
                        onChange={(e) => {
                            setImage(e.target.files[0])
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