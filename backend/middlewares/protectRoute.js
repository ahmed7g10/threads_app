const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: 'not authorized' });
        const decode = jwt.verify(token, process.env.SECRET);

        const user = await userModel.findById(decode.userId).select('-password');
        req.user = user;
        next()
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('error in protected Route', error.message);
    }
}
module.exports = protectRoute;