const { default: mongoose } = require("mongoose");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const fs = require('fs');
const path = require('path');

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: 'invailid creadentiails' })
        }
        const user = await userModel.findById(postedBy)
        if (!user) {
            return res.status(404).json({ message: ' user not found' })

        }
        if (user._id.toString() != req.user._id.toString()) {
            return res.status(400).json({ message: 'you cant create post instead of others' })
        }
        if (text.length > 500) {
            return res.status(400).json({ message: ' post sholud not be longer then 500' })
        }
        if (req?.file?.filename) {
            const post = await postModel.create({ postedBy, text, img: req.file.filename })
            return res.status(201).json({ message: 'successfully created', post })
        } else {
            const post = await postModel.create({ postedBy, text })
            return res.status(201).json(post)

        }
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log('error from creating post', error.message);

    }
}

const likePost = async (req, res) => {
    try {
        const id = req.user._id;
        const { postId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id not found' })
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post?.likes.includes(id.toString())) {
            const updatedPost = await postModel.findByIdAndUpdate(
                postId,
                { $pull: { likes: id } }, 
                { new: true } 
            ).lean();
            return res.status(200).json(updatedPost)

        }
        else {
            const updatedPost = await postModel.findByIdAndUpdate(
                postId,
                { $push: { likes: id } }, 
                { new: true } 
            ).lean();
            return res.status(201).json(updatedPost)
          
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log('error from liking post', error.message);

    }
}
const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log('error from getting post', error.message);

    }
}
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate postId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post belongs to the current user
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized: Post not yours' });
        }

        // Check if the post has an image, and delete the image file if it exists
        if (post.img) {
            const imagePath = path.join(__dirname, '..', 'uploads', post.img);

            // Use fs.unlink to delete the image file
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Error deleting image: ${err.message}`);
                    return res.status(500).json({ message: 'Error deleting post image' });
                }
                console.log(`Image ${post.img} deleted successfully`);
            });
        }

        const postr=await postModel.findByIdAndDelete(postId);
        
        res.status(200).json( postr );

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error deleting post:', error.message);
    }
};
// const deletePost = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(400).json({ message: 'Invalid post ID' });
//         }
//         const post = await postModel.findById(postId)
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         if (post.postedBy.toString() != req.user._id) {
//             return res.status(401).json({ message: 'Post not yours' });
//         }
//         await postModel.findByIdAndDelete(postId)
//         res.status(200).json(post)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//         console.log('error from getting post', error.message);

//     }
// }
const replyPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;
        const { profilePic, username } = req.user;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ message: 'text required' });

        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const reply = { userId, text, profilePic, username };

        post.replies.push(reply);
        await post.save();
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log('error from getting post', error.message);

    }
}
const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        const following = user.following;
        const feedPosts = await postModel.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
        res.status(200).json(feedPosts)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log('error from feed post', error.message);
    }
}
const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        const posts = await postModel.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log('error from get user posts ', error.message);
    }
}
module.exports = { createPost, getUserPosts, replyPost, likePost, getPost, getFeedPosts, deletePost }