import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import postReducers from './slices/postSlice';
import messageReducers from './slices/messageSlice';
import socketReducer from './slices/socketSlice';
const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducers,
        message: messageReducers,
        mySocket: socketReducer
    },middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['my_socket/setSocketId'],
                ignoredActionPaths: ['payload'],
                ignoredPaths: ['my_socket.socketId'],
                 // Only if you decide to keep the socket
            },
        }),
})

export default store;