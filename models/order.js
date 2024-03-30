const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name:{
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
        }
    ],
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String
        }
    },
    taxAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingCharges: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    deliveredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    

}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
