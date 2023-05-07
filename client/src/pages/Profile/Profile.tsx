import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { rootLink } from '../../utils/links'
import { Container, Skeleton, Box, Stack, Avatar, Typography, Divider } from '@mui/material'
import './Profile.css'

const Profile: FC = () => {

    const { id } = useParams()
    const { user, isLoggedIn } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const { data, isLoading, error } = useFetch(`${rootLink}/api/users/${id}`, localStorage.getItem('access_token'))
   

    const { data: postsData, isLoading: postsLoading } = useFetch(`${rootLink}/api/posts/user/${id}`, localStorage.getItem('access_token'))

    useEffect(() => {
        !isLoggedIn && navigate('/login')
    }, [isLoggedIn])
    return (
        <Container>

            {
                isLoading ? (
                    <>
                        <Skeleton height={100} />
                        <Skeleton height={300}>

                        </Skeleton>
                        <Stack direction='row' spacing={3}>
                            <Skeleton width={'50%'} height={200} />
                            <Skeleton width={'50%'} />
                        </Stack>
                    </>
                ) : <>
                    <Box
                        className='profile-container'
                    >
                        <Box className='container'>
                            <Avatar
                                sx={{ width: '100px', height: 'auto' }}
                                src={data?.user?.profile}
                            />
                                <Typography
                                    variant='h5'
                                    color='rgb(0,0,0,0.6)'
                                    sx={{
                                        mt: '2em',
                                        textTransform:'capitalize',
                            }}>
                                {data?.user?.names}
                            </Typography>
                        </Box>

                        <Box className='container'>
                            <Stack direction={'row'} spacing={1} divider={<Divider  orientation='vertical' flexItem/>}>
                                <Box className='data-container'>
                                    <Typography variant='h5' color='grey'>
                                        {data?.user?.friends?.length}
                                    </Typography>
                                    <Typography variant='h5' color='grey'>
                                        Friends
                                    </Typography>
                                </Box>
                                <Box className='data-container'>
                                    <Typography variant='h5' color='grey'>
                                        {postsData?.userPosts?.length || 0}
                                    </Typography>
                                    <Typography variant='h5' color='grey'>
                                        Posts
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </>
            }
        </Container>
    )
}

export default Profile