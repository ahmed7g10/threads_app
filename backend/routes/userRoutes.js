const express = require('express');
const { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser,
    getUserProfile, getSuggestedUsers, freezAccount } = require('../controllers/userController');
const protectRoute = require('../middlewares/protectRoute');
const { Upload } = require('../middlewares/imagesUpload');
const userRoutes = express.Router();
userRoutes.get('/profile/:username', getUserProfile);
userRoutes.post('/signup', signupUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);
userRoutes.get('/suggestesUsers', protectRoute, getSuggestedUsers)
userRoutes.put('/follow/:id', protectRoute, followUnFollowUser);
userRoutes.put('/update/:id', protectRoute, Upload.single('profilePic'), updateUser);
userRoutes.put('/freeze', protectRoute, freezAccount);

module.exports = userRoutes;