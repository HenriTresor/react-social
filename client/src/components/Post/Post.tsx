import React from 'react'
import {
    Avatar,
    Box, Typography, Button
} from '@mui/material'
import useDateFormatter from '../../hooks/useDateFormatter'
import './Post.css'
import { CommentBankSharp, MoreVertRounded, Share, ThumbUpAltSharp } from '@mui/icons-material'
import { likePost } from '../../utils/functions'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
export interface author {
    createdAt: Date
    email: string
    friendRequests: []
    friends: []
    gender: string
    names: string
    password: string
    sentRequest: []
    _id: string
    profile: string
}
interface post_content {
    text: string
    image?: string
}
interface props {
    author: author
    createdAt: Date
    post_comments: []
    post_content: post_content
    post_likes: []
    updatedAt: Date
    _id: string
}

const Post = ({ _id, author, createdAt, post_comments, post_likes, post_content }: props) => {

    const { formattedDate } = useDateFormatter(createdAt);
    const { user } = useSelector(state => state?.auth)
    const handleLikePost = async () => {
        const res = await likePost(user?._id, _id)
        alert(res.message)
    }
    return (
        <Box
            className='post'
        >
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        p: 2,
                        alignItems: 'center', justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 3
                        }}
                    >
                        <Avatar
                            src={author?.profile}
                        />
                        <Box>
                            <Typography
                                variant='h6' sx={{ mb: 1, textTransform: 'capitalize' }}
                            >
                                {author?.names}
                            </Typography>
                            <Typography sx={{ color: 'grey' }}>
                                {formattedDate}
                            </Typography>
                        </Box>
                    </Box>
                    <Button>
                        <MoreVertRounded />
                    </Button>
                </Box>

                <Box
                    sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 5, p: 3 }}
                >
                    <Link to={`/posts/${_id}`}>
                        <Typography
                            sx={{ cursor: 'pointer' }}
                        >
                            {post_content?.text}
                        </Typography>
                    </Link>
                    {
                        post_content?.image && (<img
                            src={post_content?.image}
                        />)
                    }
                </Box>

                <Box
                    sx={{ p: 2, mt: 2, display: 'flex', justifyContent: 'space-around' }}
                >
                    <Button
                        startIcon={<ThumbUpAltSharp />}
                        onClick={handleLikePost}
                        variant={post_likes?.find(like => like?._id === user?._id) ? 'contained' : 'outlined'}
                    >

                        {post_likes?.length}
                    </Button>
                    <Button
                        startIcon={<CommentBankSharp />}
                    >
                        {post_comments?.length}

                    </Button>
                    <Button>
                        <Share />
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Post