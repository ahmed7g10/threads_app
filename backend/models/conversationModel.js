const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        seen: {
            type: Boolean,
            default: false
        }
    },

}, { timestamps: true })

const conversationModel = mongoose.model("Conversation", conversationSchema);
module.exports = conversationModel; 