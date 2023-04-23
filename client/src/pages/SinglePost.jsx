import { Container, Paper, Button, Box, Typography } from '@mui/material'
import React, { useEffect, useReducer, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverLink } from '../utils/links'
import Loading from '../components/Loading'
import { AppData } from '../context/AppContext'
import { ThumbUpSharp, CommentRounded, ShareRounded} from '@mui/icons-material'

const reducer = (state, action) => {

    switch (action.type) {
        case 'FETCHING':
            return { loading: true }
            break;
        case 'FETCHED':
            return { loading: false, post: action.payload }
            break;
        case 'ERROR':
            return { loading: false, error: true }
    }
}
const SinglePost = () => {
    let { posts, setPosts, pageWidth, setIsDrawerOpen, currentUser } = useContext(AppData)
    const { id } = useParams()
    const [{ post, loading, error }, dispatch] = useReducer(reducer, {
        post: {},
        loading: true,
        error: false
    })

    const [postDate, setPostDate] = useState('')

    const fetchPost = async () => {
        try {
            dispatch({ type: 'FETCHING' })
            const res = await fetch(`${serverLink}/posts/${id}`, {
                method: 'GET'
            })

            const data = await res.json()
            dispatch({ type: 'FETCHED', payload: data?.post })
        } catch (err) {
            dispatch({ type: 'ERROR' })
            console.log(err);
        }
    }

    useEffect(() => {
        setPostDate(post?.createdAt)
    }, [post])
    useEffect(() => {
        fetchPost()
    }, [])
    return (
        <Container
            sx={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                flexDirection:'column'
            }}
        >
            {
                loading ? <Loading /> : (
                    <>

                        <Paper
                            elevation={4}
                            sx={{
                                width: pageWidth >= 1150 ? '55dvw' : '90%',
                                padding: 1,
                                marginBottom: 4
                            }}
                        >
                            <Box
                                className='post-header'
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1em',
                                    borderBottom: '1px solid grey',
                                    padding: 1,
                                }}
                            >
                                <img
                                    className='profile-image'
                                    src={post?.author?.profile}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'self-start'
                                    }}
                                >
                                    <Typography
                                        component='h1'
                                        variant='h6'
                                    >
                                        {post?.author?.names}
                                    </Typography>
                                    <Typography>
                                        {new Date(post?.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    padding: 1,
                                    marginTop: 1,
                                    borderBottom: '1px solid grey',
                                    textAlign: 'left'
                                }}
                                className='post-content'
                            >
                                <Typography>
                                    {post?.post_content?.text}
                                </Typography>

                                {post?.post_content?.image ? (
                                    <img
                                        src={post?.post_content?.image}
                                        className='post-image'
                                    />
                                ) : (
                                    <p></p>
                                )}
                            </Box>
                            <Box
                                className='reaction-content'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'end'
                                    }}
                                >
                                    <Typography>
                                        {post?.post_likes?.length} likes
                                    </Typography>
                                    <Button
                                        // onClick={(postId) => likePost(post?._id)}
                                        startIcon={<ThumbUpSharp />}
                                    >
                                        like
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'end'
                                    }}
                                >
                                    <Typography>
                                        {post?.post_comments?.length} comments
                                    </Typography>
                                    <Button

                                        startIcon={<CommentRounded />}
                                    >
                                        comment
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'end'
                                    }}
                                >
                                    <Typography>
                                        0 Shares
                                    </Typography>
                                    <Button
                                        startIcon={<ShareRounded />}
                                    >
                                        Share
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={4}
                            sx={{
                                width: pageWidth >= 1150 ? '55dvw' : '90%',
                                padding: 1,
                                marginBottom: 4
                            }}
                        >
                            <Typography>
                                Recent comments
                            </Typography>

                            <Box>
                                {
                                    post?.post_comments?.map(comment => {
                                        return (
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    padding: 3,
                                                    marginBottom: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
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
                                                    <img
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            marginRight: 10
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

                                                            padding: 1
                                                        }}
                                                    >
                                                        {comment?.comment?.text}
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        sx={{
                                                            marginTop: 3
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
                        </Paper>
                    </>
                )
            }
        </Container>
    )
}

export default SinglePost