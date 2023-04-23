import React, { useContext } from 'react'
import { AppData } from '../../context/AppContext'
import { Container, Paper, Fab, Box, Button, Typography } from '@mui/material'
import { ThumbUpSharp, CommentRounded, ShareRounded, Menu, NewspaperRounded } from '@mui/icons-material'
import { serverLink } from '../../utils/links'
import Loading from '../Loading'

const Body = () => {
  let { posts, setPosts, pageWidth, setIsDrawerOpen, currentUser } = useContext(AppData)

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
      {
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
                    {postDate.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
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
      }
    </Box>
  )
}

export default Body