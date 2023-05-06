import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import  SocketsSlice  from "./Sockets";

export default configureStore({
    reducer: {
        auth: AuthSlice,
        sockets: SocketsSlice
    },
})