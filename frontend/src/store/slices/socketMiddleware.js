import { setOnlineUsers } from "./socketSlice";

// socketMiddleware.js
const socketMiddleware = (socket) => {
    return (store) => (next) => (action) => {
        // Check for specific actions to handle
        if (action.type === 'my_socket/setSocket') {
            // When a socket is set, you can also add listeners or other actions
            socket.on('userConnected', (user) => {
                // Dispatch an action to update online users
                store.dispatch(setOnlineUsers(user));
            });

            socket.on('userDisconnected', (user) => {
                // Handle user disconnection
                store.dispatch(setOnlineUsers(user));
            });
        }

        return next(action);
    };
};

export default socketMiddleware;
