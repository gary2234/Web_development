const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// Importing the asyncHandler middleware to handle asynchronous operations

// Importing the User model to interact with the user data in the database

const checkRequestLimit = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    let requestLimit = 0;

    if (user.trialActive) {
        requestLimit = user.monthlyRequestCount; // Use monthlyRequestCount if trialActive is true
    } 

    if (user.requestsThisMonth >= requestLimit) {
        return res.status(403).json({ message: 'Request limit exceeded' });
    }

    next();
});

module.exports = checkRequestLimit;