// import React from 'react'
import './Body.css'
import { Container, Box, Skeleton } from '@mui/material'
import useFetch from '../../hooks/useFetch'
import { rootLink } from '../../utils/links.js'
import { useEffect, useState } from 'react'
import Post from '../Post/Post.js'
import Aside from '../Aside/Aside.js'
import LeftAside from '../Aside/AsideComponents/LeftAside.js'
import RightAside from '../Aside/AsideComponents/RightAside.js'
import { useSelector } from 'react-redux'
import Loading from '../Loading/Loading.js'

const Body = ({allUsers, posts, isLoading}) => {
 
  
  // const { } = useSelector((state) => state.auth)


  return (
    <div
      className='body-container'

    >

      <Aside >
        <LeftAside />
      </Aside>
      <Box>
        {
          isLoading ? (
            <>

              <Skeleton
                variant='rectangular'
                width={500}
              />
              <Skeleton
                variant='rectangular'
                width={500}
                sx={{ mt: 2 }}
                height={400}
              />
              <Skeleton
                variant='rectangular'
                width={500}
                sx={{ mt: 2 }}
              // height={}
              />
            </>
          ) : posts?.map((post: object) => {
            return (
              <Post key={post?._id}  {...post} />
            )
          })
        }
      </Box>
      <Aside >
        <RightAside allUsers={allUsers} />
      </Aside>
    </div>
  )
}

export default Body