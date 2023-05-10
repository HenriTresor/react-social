import React, { useEffect, useRef, useState } from 'react'
import {
    Avatar,
    Box, Typography, Button, Grid, TextField, Card
} from '@mui/material'
import useDateFormatter from '../../hooks/useDateFormatter'
import { Add, CommentBankSharp, MoreVertRounded, Share, ThumbUpAltSharp } from '@mui/icons-material'
import { addComment, likePost } from '../../utils/functions'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { rootLink } from '../../utils/links'
import useFetch from '../../hooks/useFetch'
import Loading from '../../components/Loading/Loading'
// import useDateFormatter from '../../hooks/useDateFormatter'
import '../../components/Post/Post.css'
import { options } from '../../hooks/useDateFormatter'
import './SinglePost.css'

const SinglePost = () => {
    const { id } = useParams()
    const { user } = useSelector(state => state.auth)
    const [post, setPost] = useState()
    const { data, isLoading, error } = useFetch(`${rootLink}/api/posts/${id}`)
    const { formattedDate } = useDateFormatter(post?.createdAt);
    const [comment, setComment] = useState('')

    useEffect(() => {
        setPost(data?.post)
    }, [data?.post])

    const handleAddComment = async () => {
        const res = await addComment(user?._id, post?._id, comment)
        alert(res.message)
        if (res.status) {
            setPost(prev => {
                return {
                    ...prev,
                    post_comments: [
                        ...post.post_comments,
                        {
                            user,
                            comment: {
                                text: comment,
                                date: new Date(Date.now())
                            }
                        
                        }]
                }
            })
        }
    }
    return (
        <div
            className='post-container'
            style={{ margin: '0 auto !important' }}
        >
            {
                isLoading ? <Loading /> : (
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={6} sx={6}>
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
                                                src={post?.author?.profile}
                                            />
                                            <Box>
                                                <Typography
                                                    variant='h6' sx={{ mb: 1, textTransform: 'capitalize' }}
                                                >
                                                    {post?.author?.names}
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
                                        <Link to={`/posts/${post?._id}`}>
                                            <Typography
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                {post?.post_content?.text}
                                            </Typography>
                                        </Link>
                                        {
                                            post?.post_content?.image && (<img
                                                src={post?.post_content?.image}
                                            />)
                                        }
                                    </Box>

                                    <Box
                                        sx={{ p: 2, mt: 2, display: 'flex', justifyContent: 'space-around' }}
                                    >
                                        <Button
                                            startIcon={<ThumbUpAltSharp />}
                                            // onClick={handleLikePost}
                                            variant={post?.post_likes?.find(like => like?._id === user?._id) ? 'contained' : 'outlined'}
                                        >

                                            {post?.post_likes?.length}
                                        </Button>
                                        <Button
                                            startIcon={<CommentBankSharp />}
                                        >
                                            {post?.post_comments?.length}

                                        </Button>
                                        <Button>
                                            <Share />
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item sm={12} md={6} sx={6}>
                            <Box>
                                <Typography>
                                    Comments on post by {post?.author?.names} ({post?.post_comments?.length})
                                </Typography>
                                <Box sx={{ mt: 3, display: 'flex' }}>
                                    <TextField
                                        sx={{ mr: 1 }}
                                        fullWidth={true}
                                        multiline
                                        label='comment'
                                        onChange={(e) => setComment(e.target.value)}
                                        // inputRef={commentRef}
                                        placeholder='add your comment...'
                                    />
                                    <Button variant='contained'
                                        disabled={!comment}
                                        onClick={handleAddComment}
                                    >
                                        <CommentBankSharp />
                                    </Button>
                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    {
                                        post?.post_comments?.map((comment) => (
                                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, justifyContent: 'flex-start' }}>
                                                <Avatar
                                                    sx={{ width: '30px', height: '30px' }}
                                                    src={comment?.user?.profile}
                                                />
                                                <Card
                                                    sx={{ p: 1, mb: 1, flexGrow: 1, p: 2 }}
                                                    variant='outlined'
                                                >
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography variant='body2' sx={{ display: 'block' }}>
                                                                {comment?.user?.names}
                                                            </Typography>
                                                            <Typography variant='body2'>
                                                                {new Date(comment?.comment?.date).toLocaleString('en-us', options)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ wordWrap: 'break-word' }}>
                                                            <Typography sx={{ ml: 5, mt: 1 }} variant='h6'>
                                                                {comment?.comment?.text}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                )
            }
        </div>
    )
}

export default SinglePost