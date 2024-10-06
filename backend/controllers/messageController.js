const { default: mongoose } = require("mongoose");
const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const { getRecipientSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try {
        const { recipientId, message } = req.body;
        const senderId = req.user._id;
        let conversation = await conversationModel.findOne({ participants: { $all: [senderId, recipientId] } });
        if (!conversation) {
            conversation = new conversationModel({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
            await conversation.save()
        }
        const newMessage = new messageModel({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        })
        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        ])
        const recipientSocketId = getRecipientSocketId(recipientId);

        if (recipientSocketId) {

            io.to(recipientSocketId).emit("newMessage", newMessage)

        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.error('Error sending message:', error); // Log the error on the server
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}
const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user._id;
    try {
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(404).json({ error: 'no user invalid id' })
        }
        const conversation = await conversationModel.findOne({ participants: { $all: [userId, otherUserId] } });
        if (!conversation) {
            return res.status(400).json({ error: 'conversation not found' })
        }
        const messages = await messageModel.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
        res.status(200).json(messages)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const getConversations = async (req, res) => {
    const userId = req.user._id;
    try {
        const conversations = await conversationModel.find({
            participants: {
                $in: [userId]
            }
        }).populate({
            path: "participants",
            select: "username profilePic"
        })
        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participant) => participant._id.toString() !== userId.toString()
            );
        });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports = { sendMessage, getMessages, getConversations }