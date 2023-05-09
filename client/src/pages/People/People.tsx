import React from 'react'
import './People.css'
import { Box, Button, Card, Typography, Grid } from '@mui/material'
import Contact from '../../components/Contact/Contact'
import UserCard from '../../components/UserCard/UserCard'

const People = ({ allUsers }) => {
  return (
    <div className='body-container people-container'>
      <Box>
        <Typography>
          Friend Requests
        </Typography>
      </Box>

      <Box sx={{mt:4, width:'100%'}}>
        <Typography>People You may know</Typography>

        <Box sx={{width:'100%', display:'grid', placeContent:'center'}}>
          <Grid container spacing={3}>
            {
              allUsers?.users?.map((user) => {
                return (
                 <Grid item xs={3} md={3} sm={7}>
                    <UserCard {...user} />
                 </Grid>
                )
              })
            }
        </Grid>
        </Box>
      </Box>
    </div>
  )
}

export default People