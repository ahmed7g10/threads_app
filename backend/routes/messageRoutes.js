const express = require('express');
const protectRoute = require('../middlewares/protectRoute');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');

const messageRoute = express.Router();
messageRoute.post('/', protectRoute, sendMessage);
messageRoute.get('/conversations', protectRoute, getConversations)
messageRoute.get('/:otherUserId', protectRoute, getMessages);
module.exports = messageRoute;