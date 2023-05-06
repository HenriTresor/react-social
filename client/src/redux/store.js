import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

export default configureStore({
    reducer: {
        auth: AuthSlice
    }
})