import { createSlice } from '@reduxjs/toolkit'

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: false,
        isLoading: true
    },
    reducers: {
        login: function (state, action) {
            state.user = action.payload.user
            state.isLoggedIn = true
            state.isLoading = false
        },
        logout: function (state, action) {
            state.user = null
            state.isLoggedIn = false
        }
    }
})


export const { login, logout } = AuthSlice.actions
export default AuthSlice.reducer