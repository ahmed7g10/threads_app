const jwt = require('jsonwebtoken')
const genrateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET, {
        expiresIn: '2d'
    })
    res.cookie("jwt", token, {
        httpOnly: false,// xss protaction
        maxAge: 15 * 24 * 60 * 60 * 1000,
        // maxAge: 1 * 60 * 1000, // 1 minute
        sameSite: 'None', //csrf attacks protactions
        path: '/'
    })

    return token;
}


module.exports = genrateTokenAndSetCookie;

/// to set acookie with the res we use res.cookie(nameof the cookie,value,options)