import React, {useContext} from 'react'
import { AppData } from '../context/AppContext'
import { Container, Box,Paper, Typography, Stack, Button, Divider } from '@mui/material'
const Profile = () => {

    let { currentUser } = useContext(AppData)
  return (
    <Container 
          sx={{ marginTop: 15, textAlign: 'center' }}
          className='container'>
          
          <Box>
              <Paper
                  elevation={4}
                  sx={{
                  padding:3
              }}
              >
                  <img src={currentUser?.profile} alt={`${currentUser.names} profile picture`} />
                  <Typography
                      variant='h4'
                      component='h1'
                      sx={{
                          marginTop:3
                      }}
                  >
                      {currentUser?.names}
                  </Typography>
                  <Typography>
                      { currentUser?.email}
                  </Typography>

                  <Stack
                      sx={{
                        display:'grid',
                        marginTop:3
                      }}
                      direction={'row'}
                      position={'center'}
                      spacing={2}
                      divider={<Divider orientation='vertical' flexItem/>}
                  >
                      <Box>
                          <Button>
                              Friends
                          </Button>
                          <Button>
                              your contents
                          </Button>
                      </Box>
                  </Stack>

                  <Stack
                      sx={{
                          display: 'grid',
                          marginTop: 3
                      }}
                      direction={'row'}
                      position={'center'}
                      spacing={2}
                      divider={<Divider orientation='vertical' flexItem />}
                  >
                      <Box>
                          {
                              currentUser?.friends?.map(friend => {
                                  return (
                                      <Paper key={friend._id}
                                          elevation={6}
                                          sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              marginBottom: 2,
                                              padding:1
                                      }}
                                      >
                                          <Box
                                              sx={{
                                                  display: 'flex',
                                                  alignItems:'center'
                                          }}
                                          >
                                              <img src={friend?.profile} alt={`${friend?.names} profile pic`} />
                                              <Typography>
                                                  {friend?.names}
                                              </Typography>
                                        </Box>
                                          <Button
                                              color='warning'
                                              variant='outlined'
                                          >
                                            
                                              unfriend
                                          </Button>
                                      </Paper>
                                  )
                              })
                          }
                      </Box>
                  </Stack>
              </Paper>
          </Box>
    </Container>


  )
}

export default Profile