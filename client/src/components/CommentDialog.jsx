import React, { useContext, useEffect, useState } from 'react'
import { serverLink } from '../utils/links.js'
import {
    Button,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    Paper,
    Avatar
} from '@mui/material'
import { AppData } from '../context/AppContext.tsx'
import { useNavigate } from 'react-router-dom'


export const CommentDialog = ({ isCommentModalOpen, setIsCommentModalOpen, thisPost, setGlobalSnackBarMsg, setGlobalSnackBarOpen }) => {
    const [comment, setComment] = useState('')

    const { currentUser } = useContext(AppData)
    const addPost = async () => {
        try {

            if (comment === '') {
                setGlobalSnackBarOpen(true)
                setGlobalSnackBarMsg('input the comment text')

                return
            }
            const res = await fetch(`${serverLink}/posts/${thisPost?._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({ userId: currentUser?._id, comment })
            })

            const data = await res.json()
            setGlobalSnackBarOpen(true)
            setGlobalSnackBarMsg(data.message)
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <Dialog
            open={isCommentModalOpen}
        >
            <DialogTitle
                sx={{
                    padding: 5,
                    display: 'flex',
                    justifyContent:'space-between'
            }}
            >
                add comment on {thisPost?.author?.names}' post
                <Button
                    color='warning'
                    variant='outlined'
                    onClick={() => setIsCommentModalOpen(false)}
                >
                    cancel
                </Button>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {thisPost?.post_content?.text.slice(0, 100)}...
                </DialogContentText>
                <DialogActions
                    sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <TextField
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        variant='standard'
                        label='comment...'
                        multiline
                        placeholder='this is a multiline text field'
                    />
                    <Box>
                      
                        <Button
                            variant='contained'
                            color='success'
                            sx={{
                                marginTop:3
                            }}
                            onClick={addPost}
                        >
                            Add comment
                        </Button>
                    </Box>
                </DialogActions>
                <Typography>
                    Recent comments
                </Typography>
                <Box
                    sx={{
                        marginTop: 3
                    }}
                >
                    {
                        thisPost?.post_comments?.map(comment => {
                            return (
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: 3,
                                        marginBottom: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent:'center',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                    key={comment}
                                >
                                    <Box
                                        sx={{
                                            padding: 1,
                                            borderRadius: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Avatar sx={{
                                            width: '150px',
                                            height: '150px'
                                        }}
                                           
                                            src={comment?.user?.profile}
                                            className='profile-image'
                                        />
                                        <Typography>
                                            {comment?.user?.names}
                                        </Typography>


                                    </Box>
                                    <Box>
                                        <Typography
                                            sx={{
                                                border: '1px solid grey',
                                                padding:3
                                        }}
                                        >
                                            {comment?.comment?.text}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{
                                            marginTop:3
                                        }}
                                        >
                                            {new Date(comment?.comment?.date).toDateString()}
                                        </Typography>
                                    </Box>
                                </Paper>
                            )
                        })
                    }
                </Box>
            </DialogContent>
        </Dialog>
    )
}
