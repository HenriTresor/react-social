// import React from 'react'
import {
    List, ListItem, ListItemAvatar,
    ListItemButton, ListItemText, Box,
    Avatar,
    TextField, Typography, Button
} from '@mui/material'

import {
    People,
    PagesRounded,
    MessageSharp
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import Loading from '../../Loading/Loading'
import { createPost } from '../../../utils/functions'
import Modal from '../../modals/Modal'
import { useRef, useState } from 'react'
import {Link} from 'react-router-dom'

const LeftAside = () => {
    const { user, isLoading } = useSelector(state => state.auth)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const modalRef = useRef(null)
    const [post_content, setPostContent] = useState('')

    const post = async () => {
        const res = await createPost(user?._id, { text: post_content })
        if (res?.status) {
            modalRef.current.close()
        }
    }
    return (
        <>

            <List
                sx={{ width: '100%' }}
            >
                {
                    isLoading ? <Loading /> : (
                        <>
                            <Box>
                                <TextField
                                    fullWidth
                                    placeholder='what is on your mind?'
                                    name='post'
                                    onClick={() => modalRef.current?.showModal()}
                                />
                            </Box>
                            <ListItem sx={{ width: '100%' }}>
                                <Link to={`/profile/${user?._id}`}>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                src={user?.profile}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            {user?.names?.split(' ')[0] || 'usernames'}
                                        </ListItemText>
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to='/people'>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <People />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            Friends
                                        </ListItemText>
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to='/pages'>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <PagesRounded />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            Pages
                                        </ListItemText>
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to='/chat-room'>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <MessageSharp />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            Messages
                                        </ListItemText>
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        </>
                    )
                }
            </List>
            <Modal modalRef={modalRef}>
                <Box>
                    <Typography>
                        Create new post
                    </Typography>

                    <Box
                        className='new-post-modal'
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <textarea
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder='what is on your mind?' name="" id="" cols="30" rows="5"></textarea>
                        <input type="file" id='photo' value="" name='photo' />
                        <label htmlFor="photo">add photo</label>
                    </Box>
                    <Button
                        onClick={post}
                        variant='contained'>proceed</Button>
                </Box>
            </Modal>
        </>
    )
}

export default LeftAside