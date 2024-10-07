const userModel = require("../models/userModel");
const postModel = require("../models/postModel")
const bcryt = require('bcryptjs');
const genrateTokenAndSetCookie = require("../utils/helpers/genrateTokenAndSetCookie");
const { default: mongoose } = require("mongoose");
const { Upload } = require('../middlewares/imagesUpload')
const path=require('path');
const fs=require('fs')
const signupUser = async (req, res) => {
    try {
        const { username, name, password, email } = req.body;
        const user = await userModel.findOne({ $or: [{ email }, { username }] })
        if (!username || !name || !password || !email) {
            return res.status(400).json({ message: 'all faild are required' });
        }
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryt.genSalt(10);
        const hashPasswd = await bcryt.hash(password, salt)
        const userr = await userModel.create({
            username,
            name, password: hashPasswd, email
        })
        if (userr) {
            const i_need = genrateTokenAndSetCookie(userr._id, res)
            return res.status(201).json({
                _id: userr._id,
                name: userr.name,
                username: userr.username,
                email: userr.email,
                bio: user?.bio || "",
                profilePic: user?.profilePic || "",
                isFrozen: false,
                for_expr: i_need
            })
        }
        else {
            return res.status(400).json({ message: 'unkonow error try agine' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in sign up user', error.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'all faild are required' });
        }
        const user = await userModel.findOne({ username })
        
        const isPasswordCorrect = await bcryt.compare(password, user?.password || "")
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: 'Wrong Password or Username' });
        }
        //let my = genrateTokenAndSetCookie(user._id, res); //becuse it dreturn a token 
        //console.log(my);
        user.isFrozen = false
        await user.save()
        const i_need = genrateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio || "",
            profilePic: user.profilePic,
            isFrozen: false,
            for_expr: i_need

        })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in login user', error.message);
    }
}

const logoutUser = async (req, res) => {
    try {
        // deleting the cookie
        res.cookie('jwt', '', { maxAge: 1 });
        return res.status(200).json({
            message: " user looged out successfully"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in logout user', error.message);
    }
}

const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await userModel.findById(id);
        const currentuser = await userModel.findById(req.user._id)
        if (!userToModify || !currentuser) {
            return res.status(400).json({
                message: "user not found to follow"
            })
        }
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                message: "you can,t follow your self"
            })
        }
        const isFollowing = currentuser.following.includes(id);
        if (isFollowing) {
            await userModel.findByIdAndUpdate(id, { $pull: { followers: currentuser._id } })
            await userModel.findByIdAndUpdate(currentuser._id, { $pull: { following: id } })
            return res.status(201).json({
                message: 'unfollow successfully'
            })
        } else {
            await userModel.findByIdAndUpdate(id, { $push: { followers: currentuser._id } })
            await userModel.findByIdAndUpdate(currentuser._id, { $push: { following: id } })
            return res.status(201).json({
                message: 'yes follow successfully'
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in follow un follow user', error.message);
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, username, password, email, bio } = req.body;
        let user = await userModel.findById(userId);
        if (!user) return res.status(400).json({ message: "user Not Found" });
        if (password) {
            const salt = await bcryt.genSalt(10)
            const hashPasswd = await bcryt.hash(password, salt);
            user.password = hashPasswd;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        if (req?.file?.filename){
            if(user.profilePic){
                imagePath=path.join(__dirname,'..','uploads',user.profilePic);
            fs.unlink(imagePath,(e)=>{
                console.log(e);
                
            })
            }
        }
        user.profilePic = req?.file?.filename || user.profilePic;
        user.bio = bio || user.bio;
        user = await user.save();
        await postModel.updateMany({ "replies.userId": userId }, {
            $set: {
                "replies.$[reply].username": user.username,
                "replies.$[reply].profilePic": user.profilePic
            },
        }, {
            arrayFilters: [{ "reply.userId": userId }]
        })
        res.status(200).json({ message: 'profile updated successfully', user })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in updating user', error.message);
    }
}
const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        if (mongoose.Types.ObjectId.isValid(username)) {
            const user = await userModel.findById(username).select('-password');
            if (!user) {
                return res.status(400).json({ message: "user Not Found" });
            }
            return res.status(200).json({
                message: "profile",
                user
            })
        }



        const user = await userModel.findOne({ username }).select('-password')

        if (!user) return res.status(400).json({ message: "user Not Found" });
        return res.status(200).json({
            message: "profile",
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in getting user profile ', error.message);
    }
}
const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByYou = await userModel.findById(userId).select("following");

        const users = await userModel.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            {
                $sample: { size: 10 },
            },
        ]);
        const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in getSuggestedUsers user profile ', error.message);
    }
}
const freezAccount = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        user.isFrozen = true;
        await user.save();

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in freeze ', error.message);
    }
}
module.exports = {
    signupUser, getUserProfile, freezAccount, loginUser, getSuggestedUsers
    , logoutUser, followUnFollowUser, updateUser
}