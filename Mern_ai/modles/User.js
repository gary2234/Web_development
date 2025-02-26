const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    trialPeriod: {
        type: Number,
        required: true
    },
    trialActive: {
        type: Boolean,
        default: false
    },
    trialExpense: {
        type: Date
    },
    subscriptionPlan: {
        type: String,
        enum: ['Trial', 'Free', 'Basic', 'Premium'],
        default: 'Trial'
    },
    apiRequestCount: {
        type: Number,
        default: 0
    },
    monthlyRequestCount: {
        type: Number,
        default: 0
    },
    nextBillingDate: {
        type: Date
    },
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    contentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContentHistory'
    }],
    timespace: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;