import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { rootLink } from '../../utils/links'
import {
    Container, Skeleton,
    Box, Button, Stack, Avatar,
    Typography, Divider, IconButton
} from '@mui/material'
import './Profile.css'
import { Edit, CameraAlt } from '@mui/icons-material'

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
                           <Box>
                                    <Avatar
                                        sx={{ width: '100px', height: '100px', objectFit: 'fill' }}
                                        src={data?.user?.profile}
                                    />
                                    <IconButton id='camera-btn'>
                                        <CameraAlt />
                                    </IconButton>
                           </Box>
                            <Typography
                                variant='h5'
                                color='rgb(0,0,0,0.6)'
                                sx={{
                                    mt: '2em',
                                    textTransform: 'capitalize',
                                }}>
                                {data?.user?.names}
                                </Typography>
                                
                                <Typography>
                                    {data?.user?.email}
                                </Typography>

                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography color='grey'>
                                    {data?.user?._id === user?._id ? 'About me ...' : `About ${data?.user?.names}`}
                                </Typography>
                                   
                                </Box>
                                {data?.user?._id === user?._id &&
                                    (<IconButton id='edit-btn'>
                                        <Edit />
                                    </IconButton>)}
                        </Box>

                        <Box className='container'>
                            <Stack direction={'row'} spacing={1} divider={<Divider orientation='vertical' flexItem />}>
                                <Box className='data-container'>
                                    <Typography variant='h5' color='grey'>
                                        {data?.user?.friends?.length}
                                    </Typography>
                                    <Typography variant='h5' color='grey'>
                                        Friends
                                    </Typography>
                                    <Button>
                                        view friends
                                    </Button>
                                </Box>
                                <Box className='data-container'>
                                    <Typography variant='h5' color='grey'>
                                        {postsData?.userPosts?.length || 0}
                                    </Typography>
                                    <Typography variant='h5' color='grey'>
                                        Posts
                                    </Typography>
                                    <Button>
                                        view posts
                                    </Button>
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