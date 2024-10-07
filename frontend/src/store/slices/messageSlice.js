
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URL } from '../../MY_ENV/API.JS';
export const getConversations = createAsyncThunk('/messages/getconv', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_URL}/messages/conversations`, {
            headers: {
                "content-type": "application/json"
            },
            credentials: 'include'
        });
        const data = await res.json()
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        conversations: [],
        selectedConversation: {
            _id: "",
            userId: "",
            userProfilePic: "",
            username: "",
            mock: false
        },
        status,
        error: null
    },
    reducers: {
        changeConversation(state, action) {
            state.selectedConversation = action.payload;
        },
        mockConversation(state, action) {
            console.log(action.payload);

            state.conversations = [...state.conversations, action.payload];
        },
        updateConversations(state, action) {
            const { s_id, Lmessage } = action.payload;
            console.log(action.payload);

            state.conversations = state.conversations.map((con) => {
                if (con._id === s_id) {
                    return {
                        ...con,
                        lastMessage: {
                            text: Lmessage.message,
                            sender: Lmessage.sender
                        }
                    };
                }
                return con;
            });
        },
        updateConversationLastMessage(state, action) {
            const { s_id, message } = action.payload;
            if (s_id == message.conversationId) {
                state.conversations = state.conversations.map((con) => {
                    if (con._id === s_id) {
                        console.log(con);
                        return {
                            ...con,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender
                            }
                        };
                    }
                    return con;
                });
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getConversations.pending, (state) => {
                state.status = 'loading';  // Set status to 'loading'
                state.error = null;
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.status = 'succeeded';  // Set status to 'succeeded'
                state.conversations = action.payload;
                state.error = null;
            })
            .addCase(getConversations.rejected, (state, action) => {
                state.status = 'failed';  // Set status to 'failed'
                state.error = action.payload;
            });
    }
})
export const { changeConversation, mockConversation, updateConversations, updateConversationLastMessage } = messageSlice.actions;
export default messageSlice.reducer;