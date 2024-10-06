const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    }
    ,
    following: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ""
    },
    isFrozen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
const userModel = mongoose.model('User', userSchema)
module.exports = userModel;