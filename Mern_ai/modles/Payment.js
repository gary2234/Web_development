const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    subscriptionPlan: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    monthlyRequestCount: {
        type: Number,
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);