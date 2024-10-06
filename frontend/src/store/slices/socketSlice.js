import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: 'my_socket',
    initialState: {
        socket: null,
        onlineUsers: [],
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
})
export const { setSocket, setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;