const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuthenticated = asyncHandler(async (req, res, next) => {
    if(req.cookies.token){
        //! Verify the token
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);//the acutal login user
        //add the user to the request object
        req.user = await User.findById(decoded?.id).select("-password");
    }else{
        return res.status(401).json({message:"Not authorized, no user found"});
    }
});

module.exports = { isAuthenticated };