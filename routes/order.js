const express = require('express');
const router = express.Router();

const {createOrder, getSingleOrder, getLoggedInUserOrders, 
    getAllOrders , updateOrder, deleteOrder
} = require('../controllers/orderController');

const {isLoggedIn, customRole} = require('../middlewares/user');

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getSingleOrder);
router.route("/my-order").get(isLoggedIn, getLoggedInUserOrders);

router.route("/admin/orders").get(isLoggedIn, customRole('admin'), getAllOrders);
router.route("/admin/order/:id").put(isLoggedIn, customRole('admin'), updateOrder);
router.route("/admin/order/:id").delete(isLoggedIn, customRole('admin'), deleteOrder);




module.exports = router;