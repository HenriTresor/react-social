// import React from 'react'
import {
    List, ListItem, ListItemAvatar,
    ListItemButton, ListItemText,
    Avatar
} from '@mui/material'

import {
    People,
    PagesRounded,
    MessageSharp
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import Loading from '../../Loading/Loading'

const LeftAside = () => {
    const { user, isLoading } = useSelector(state => state.auth)
    return (
        <>
            <List
                sx={{ width: '100%' }}
            >
                {
                    isLoading ? <Loading /> : (
                        <>
                            <ListItem sx={{ width: '100%' }}>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={user?.profile}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        {user?.names?.split(' ')[0] || 'usernames'}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <People />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        Friends
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <PagesRounded />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        Pages
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <MessageSharp />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        Messages
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </>
                    )
               }
            </List>
        </>
    )
}

export default LeftAside