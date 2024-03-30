
const express = require('express');
const router = express.Router();
const {isLoggedIn } = require('../middlewares/user');
const {sendStripeKey, makePaymentByStripe, sendRazorpayKey, makePaymentByRazorpay} = require('../controllers/paymentController');

router.get('/stripe-key', sendStripeKey);
router.post('/stripe-payment', isLoggedIn,  makePaymentByStripe);
router.get('/razorpay-key', sendRazorpayKey);
router.post('/razorpay-payment', isLoggedIn,  makePaymentByRazorpay);




module.exports = router;