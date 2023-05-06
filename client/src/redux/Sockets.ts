import { createSlice } from '@reduxjs/toolkit'

const SocketsSlice = createSlice({
    name: 'sockets',
    initialState: {
        onlineUsers: []
    },
    reducers: {
        getOnlineUsers: (state, action) => {
            console.log('acrion',action);
            
            state.onlineUsers = action.payload.onlineUsers
        }
    }
})


export const { getOnlineUsers } = SocketsSlice.actions
export default SocketsSlice.reducer