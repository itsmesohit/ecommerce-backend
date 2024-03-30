const bigPromise = require('../middlewares/bigPromise');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Razorpay = require('razorpay');


exports.sendStripeKey = bigPromise(async (req, res, next) => {
    res.status(200).json({
        stripe_key: process.env.STRIPE_KEY
    });
});


exports.makePaymentByStripe = bigPromise(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        payment_method: req.body.payment_method,
        confirm: true,
        metaData: {
            integration_check: 'accept_a_payment'
        }
    });
    res.status(200).json({
        message: 'Payment successful',
        paymentIntent
    });
});

exports.sendRazorpayKey = bigPromise(async (req, res, next) => {
    res.status(200).json({
        razorpay_key: process.env.RAZORPAY_KEY
    });
});

exports.makePaymentByRazorpay = bigPromise(async (req, res, next) => {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const options = {
        amount: req.body.amount,
        currency: 'INR',
        receipt: 'receipt#1',
        payment_capture: 1
    };
    const myOrder = await instance.orders.create(options);
    res.status(200).json({
        message: 'Order created successfully',
        myOrder
    });
});
