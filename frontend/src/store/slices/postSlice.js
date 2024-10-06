import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
export const getfeedPosts = createAsyncThunk('my_posts/getfeedPosts', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const res = await fetch(`http://localhost:5000/api/posts/feed`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error.message);
        return rejectWithValue(error.message);
    }
});
export const getPOST = createAsyncThunk('my_posts/getpost', async (pid, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
        const res = await fetch(`http://localhost:5000/api/posts/${pid}`, {
            method: 'GET', credentials: 'include',

        });
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }

});
export const likePOST = createAsyncThunk('my_posts/likepost', async ({ p_id, isalot }) => {
    try {
        const res = await fetch("http://localhost:5000/api/posts/like/" + p_id, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return { post: data, isalot };
    } catch (error) {
        return error.message;
    }
});

export const replyPOST = createAsyncThunk('my_posts/replypost', async (d) => {
    try {
        const res = await fetch("http://localhost:5000/api/posts/reply/" + d.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }, credentials: 'include',
            body: JSON.stringify({ text: d.text }),
        });
        const data = await res.json();
        return { post: data, isalot: d.isalot };

    } catch (error) {
        console.log(error.message);

    }
});
export const getUserPosts = createAsyncThunk('my_posts/getuserposts', async (username) => {
    try {
        const res = await fetch(`http://localhost:5000/api/posts/user/${username}`, {
            method: 'GET'
        });
        const data = await res.json();

        return data
    } catch (error) {
        console.log(error.message);

    }
});
export const deleteUserPost = createAsyncThunk('my_posts/deletepost', async (iid) => {
    try {
        const res = await fetch(`http://localhost:5000/api/posts/${iid}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error.message);

    }
})
export const createPostForUser = createAsyncThunk('my_posts/createpost', async (d) => {
    try {
        const with_file = new FormData();
        with_file.append('text', d.text);
        with_file.append('postedBy', d.postedBy);
        if (d.img!="non") {
             with_file.append('img', d.img);
        }
        const res = await fetch(`http://localhost:5000/api/posts/create`, {
            method: 'POST',
            credentials: 'include',
            body: with_file
        })
        const data = await res.json();
        return data
    } catch (error) {
        console.log(error.message);
    }
})
const postSlice = createSlice({
    name: 'my_posts',
    initialState: {
        posts: [],
        post: {},
        userPosts: [],
        status: 'loading',
        error: null
    }, reducers: {
    }, extraReducers: (builder) => {
        builder.addCase(getfeedPosts.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(getfeedPosts.fulfilled, (state, action) => {
                state.status = 'filled';
                state.posts = action.payload;
            })
            .addCase(getfeedPosts.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action.payload);

                state.error = action.error.message;
            })
            .addCase(getPOST.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getPOST.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.post = action.payload;

            })
            .addCase(getPOST.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action.payload);

                state.error = action.error.message;
            })
            .addCase(likePOST.pending, (state) => {
                state.status = 'loadinglike';
            })
            .addCase(likePOST.fulfilled, (state, action) => {
                state.status = 'succeeded';

                const reply_to = action.payload.post;
                console.log(                action.payload.isalot)
                if (action.payload.isalot) {
                    state.posts = state.posts.map(post =>
                        post._id === reply_to._id ? reply_to : post
                    );
                    state.userPosts = state.userPosts.map(post =>
                        post._id === reply_to._id ? reply_to : post
                    );
                } else {
                    state.post = action.payload.post;
                }
            })
            .addCase(likePOST.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(replyPOST.pending, (state) => {
                state.status = 'loadingreply';
            })
            .addCase(replyPOST.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const reply_to = action.payload.post;

                if (action.payload.isalot) {
                    state.posts = state.posts.map(post =>
                        post._id === reply_to._id ? reply_to : post
                    );
                    state.userPosts = state.userPosts.map(post =>
                        post._id === reply_to._id ? reply_to : post
                    );
                } else {
                    state.post = action.payload.post;
                }

            })
            .addCase(replyPOST.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getUserPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userPosts = action.payload;
            })
            .addCase(getUserPosts.rejected, (state) => {
                state.status = 'falid';
            })
            .addCase(createPostForUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPostForUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userPosts = [action.payload, ...state.userPosts];
            })
            .addCase(createPostForUser.rejected, (state) => {
                state.status = 'falid';
            })
            .addCase(deleteUserPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUserPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userPosts = state.userPosts.filter(p => p._id !=action.payload._id);
            })
            .addCase(deleteUserPost.rejected, (state) => {
                state.status = 'falid';
            })
    }
})

export default postSlice.reducer;