const express = require('express');
const { createPost, likePost, getPost, deletePost, replyPost, getFeedPosts, getUserPosts } = require('../controllers/postController');
const protectRoute = require('../middlewares/protectRoute');
const { Upload } = require('../middlewares/imagesUpload');
const postRoutes = express.Router()
postRoutes.post('/create', protectRoute, Upload.single('img'), createPost);
postRoutes.get('/feed', protectRoute, getFeedPosts)

postRoutes.put('/like/:postId', protectRoute, likePost)
postRoutes.get('/:postId', getPost)
postRoutes.delete('/:postId', protectRoute, deletePost)
postRoutes.put('/reply/:postId', protectRoute, replyPost)
postRoutes.get('/user/:username', getUserPosts)
module.exports = postRoutes;