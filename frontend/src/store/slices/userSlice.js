import { createSlice } from "@reduxjs/toolkit";
const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user-threads');
    return user ? JSON.parse(user) : null;
};
const userSlice = createSlice({
    name: 'me',
    initialState: {
        isLoggedIn: !!getUserFromLocalStorage(),
        user: getUserFromLocalStorage()
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true,
                state.user = action.payload;
            localStorage.setItem('user-threads', JSON.stringify(action.payload));
        },
        logout(state, action) {
            state.isLoggedIn = false;
            localStorage.removeItem('user-threads');
            state.user = null;
        },
        update(state, action) {
            state.user = action.payload;
            localStorage.setItem('user-threads', JSON.stringify(action.payload));

        }
    }
})
export const { login, logout, update } = userSlice.actions;
export default userSlice.reducer;
//localStorage.setItem("user-threads", JSON.stringify(data));
