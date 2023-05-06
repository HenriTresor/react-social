// import React from 'react'
import './Body.css'
import { Container, Box } from '@mui/material'
import useFetch from '../../hooks/useFetch'
import { rootLink } from '../../utils/links.js'
import { useEffect, useState } from 'react'
import Post from '../Post/Post.js'
import Aside from '../Aside/Aside.js'
import LeftAside from '../Aside/AsideComponents/LeftAside.js'
import RightAside from '../Aside/AsideComponents/RightAside.js'
import { useSelector } from 'react-redux'

const Body = () => {
  const { data, isLoading, error } = useFetch(`${rootLink}/api/posts`)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (data?.status) {
      setPosts(data.posts)
    }
  }, [data])

  return (
    <div
      className='body-container'

    >

      <Aside >
        <LeftAside />
      </Aside>
      <Box>
        {
          posts && posts?.map((post: object) => {
            return (
              <Post key={post?._id}  {...post} />
            )
          })
        }
     </Box>
      <Aside >
        <RightAside />
      </Aside>
    </div>
  )
}

export default Body