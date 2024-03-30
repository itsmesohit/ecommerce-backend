const express = require('express');


const {addProduct, getAllProducts, adminGetAllProducts,
     getProduct, adminUpdateProduct,
     adminDeleteProduct, addReview,
     deleteAReview, getReviews
     } = require('../controllers/productController');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');


// all users routes
router.route('/products').get( isLoggedIn ,getAllProducts);
router.route('/product/:id').get( isLoggedIn , getProduct);

router.route('/review').put( isLoggedIn , addReview);
router.route('/reviews').get( getReviews);
router.route('/review').delete( isLoggedIn , deleteAReview);




// admin routes
router.route('/admin/product/add').post( isLoggedIn , customRole('admin'), addProduct);
router.route('/admin/products').get( isLoggedIn , customRole('admin'), adminGetAllProducts);
router.route('/admin/product/:id').put( isLoggedIn , customRole('admin'), adminUpdateProduct).delete( isLoggedIn , customRole('admin'), adminDeleteProduct);




module.exports = router;

