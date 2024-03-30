const Order = require('../models/order');
const Product = require('../models/product');
const bigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');

exports.createOrder = bigPromise(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingCharges,
        totalAmount,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingCharges,
        totalAmount,
        user: req.user._id,
    });
    res.status(200).json({
        success: true,
        order,
    });

});


exports.getSingleOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new Error('Order not found with this id'));
    }
    res.status(200).json({
        success: true,
        order,
    });
});

exports.getLoggedInUserOrders = bigPromise(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders,
    });
});

exports.getAllOrders = bigPromise(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalAmount;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

exports.updateOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new Error('Order not found with this id'));
    }
    if(order.orderStatus === 'delivered'){
        
        return next(new CustomError('You have already delivered this order', 400));
    }

    // update delivered date 
    if (req.body.status === 'delivered') {
        req.body.deliveredAt = Date.now();
    }

    order.orderStatus = req.body.status;
    order.orderItems.forEach(async (item) => {
        await updateProductStock(item.product, item.quantity);
    });

    await order.save();
    res.status(200).json({
        success: true,
        order,
    });
});


async function updateProductStock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false});
    
}


exports.deleteOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new Error('Order not found with this id'));
    }
    await order.remove();
    res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
    });
});


