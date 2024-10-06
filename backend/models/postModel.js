const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLength: 500
    },
    img: { type: String },
    likes: [],
    replies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, text: {
            type: String,
            maxLingth: 500
        },
        username: {
            type: String
        },
        profilePic: {
            type: String
        },
        likes: [],
        createdAt: {
            type: Date,
            default: Date.now // Automatically sets the date when the reply is created
        }
    }]
}, { timestamps: true })
const postModel = mongoose.model('Post', postSchema)
module.exports = postModel;
