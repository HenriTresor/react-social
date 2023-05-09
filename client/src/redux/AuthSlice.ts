import { StaticDateTimePicker } from "@mui/lab";
import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    isLoading: true,
  },
  reducers: {
    login: function (state, action) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    logout: function (state, action) {
      state.user = null;
      state.isLoggedIn = false;
    },
    confirmRequest: (state, action) => {
      // state = {.`..state, user: {...state.user, friends:state.user?.friends?.push(action.payload.user)}}

        state.user.friendRequests = state.user.friendRequests?.filter(request => request?._id !== action.payload.user?._id)

      state.user.friends = state.user?.friends.push(action.payload.user);
      },
      addRequest: (state, action) => {
        state.user.sentRequests = state.user?.sentRequests?.push(action.payload.user)
    }
  },
});

export const { login, logout, confirmRequest, addRequest } = AuthSlice.actions;
export default AuthSlice.reducer;
