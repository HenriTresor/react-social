import React, { useContext, useState } from 'react'
import { AppData } from '../../context/AppContext'
import { Container, Paper, Fab, Box, Button, Typography, Avatar } from '@mui/material'
import { ThumbUpSharp, CommentRounded, ShareRounded, Menu, NewspaperRounded } from '@mui/icons-material'
import { serverLink } from '../../utils/links'
import Loading from '../Loading'
import { CommentDialog } from '../CommentDialog'
import { Link } from 'react-router-dom'

const Body = ({ setGlobalSnackBarMsg, setGlobalSnackBarOpen }) => {
  let { posts, setPosts, pageWidth, setIsDrawerOpen, currentUser, setIsModalOpen } = useContext(AppData)

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [thisPost, setThisPost] = useState({})
  const likePost = async (postId) => {
    try {
      const res = await fetch(`${serverLink}/posts/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUser?._id, postId: postId })
      })

      const data = await res.json()
      const post = posts?.find(post => post?._id === postId)

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  if (!posts) {
    return <Loading />
  }
  return (
    <Box
      className='body'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <CommentDialog
        isCommentModalOpen={isCommentModalOpen}
        setIsCommentModalOpen={setIsCommentModalOpen}
        setGlobalSnackBarMsg={setGlobalSnackBarMsg}
        setGlobalSnackBarOpen={setGlobalSnackBarOpen}
        thisPost={thisPost}
      />

      <Fab
        size='small'
        color='error'
        sx={{
          float: 'left',
          left: '0',
          padding: 0.5,
          top: '4em',
          position: 'fixed',
          clear: 'both'
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        <Menu />
      </Fab>
    
      {posts?.length === 0 ? (
        <Box
          sx={{
            height: '100dvh',
            display: 'grid',
            placeContent: 'center',
            gap:5
        }}
        >
          <Typography>
            No posts
          </Typography>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant='contained'>
            create a new post
          </Button>
      </Box>
      ) : (
        posts?.map(post => {
          console.log(post);
          let postDate = new Date(post?.createdAt)
          return (
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
                <Avatar
                  sx={{
                    width: '70px',
                    height: '70px'
                  }}
               
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
                    {postDate.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Link
                to={`/posts/${post?._id}`}
              >

                <Box
                  sx={{
                    cursor: 'pointer',
                    textDecoration:'none',
                    padding: 1,
                    marginTop: 1,
                    borderBottom: '1px solid grey',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap:2
                  }}
                  className='post-content'
                >
                  <Typography>
                    {post?.post_content?.text}
                  </Typography>

                  {post?.post_content?.image ? (
                    <img
                      
                      style={{
                        width: '50%',
                        transform: 'scale(1)',
                        justifySelf:'center'
                      }}
                      src={post?.post_content?.image}
                      className='post-image'
                    />
                  ) : (
                    <p></p>
                  )}
                </Box>
              </Link>

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
                    {post?.post_likes.length} likes
                  </Typography>
                  <Button
                    onClick={(postId) => likePost(post?._id)}
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
                    {post?.post_comments.length} comments
                  </Typography>
                  <Button
                    onClick={() => {
                      setIsCommentModalOpen(true)
                      setThisPost(post)
                    }}
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
          )
        })
      )
      }
    </Box>
  )
}

export default Body