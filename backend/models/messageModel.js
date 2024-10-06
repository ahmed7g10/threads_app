const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;