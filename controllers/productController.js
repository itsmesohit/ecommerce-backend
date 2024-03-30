const bigPromise = require("../middlewares/bigPromise");
const Product = require("../models/product");
const customError = require("../utils/customError");
const fileupload = require("express-fileupload");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;



exports.addProduct = bigPromise(async (req, res, next) => {
    // image array 
    let imagesOfProduct = [];
    // check if there is a file

    if (req.files) {
        // loop through the files

        for( let i = 0; i < req.files.photos.length; i++){
            let file = req.files.photos[i];
            let result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "product",
            });
            imagesOfProduct.push({
                public_id: result.public_id,
                secure_url: result.secure_url,
            });

        }
    }else {
        return next(new customError('Please provide a images of product', 400));
    }
    console.log(imagesOfProduct);
    // create a new product
    req.body.photos = imagesOfProduct;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({ message: 'Product added successfully', product });

});

exports.getAllProducts = bigPromise(async (req, res, next) => {
    let pagePerProduct = 4;
    const totalProductsCount = await Product.countDocuments();
    const productsObj = new WhereClause(Product.find(), req.query).search().filter();

    let products = await productsObj.base;

    const filteredProductsCount = products.length;

    productsObj.pager(pagePerProduct);

    products = await productsObj.base.clone();

    
    res.status(200).json({  success : true,
        products,
        totalProductsCount,
        filteredProductsCount
    });
});

exports.getProduct = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new customError(`Product not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, product });
});

exports.addReview = bigPromise(async (req, res, next) => {
    const { rating, comment,productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true , message: 'Review added' });
});

exports.getReviews = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({ success: true, reviews: product.reviews });
});

exports.deleteAReview = bigPromise(async (req, res, next) => {
    const {productId } = req.query;
    const product = await Product.findById(productId);
    const reviews = product.reviews.filter((review) => review.uset.toString() !== req.user._id.toString());
    const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await Product
        .findByIdAndUpdate(productId, {
            reviews,
            ratings,
            numOfReviews,
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    res.status(200).json({ success: true, message: 'Review deleted' });
});
    


exports.adminGetAllProducts = bigPromise(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

exports.adminUpdateProduct = bigPromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new customError(`Product not found with id of ${req.params.id}`, 404));
    }
    // image array
    let imagesOfProduct = [];
    // check if there is a file
    
    if (req.files) {
        // loop through the files
        for( let i = 0; i < req.files.photos.length; i++){
            let file = req.files.photos[i];
            let result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "product", // -----> this can be put in to the .env file
            });
            imagesOfProduct.push({
                public_id: result.public_id,
                secure_url: result.secure_url,
            });
        }
        // delete the old images
        for (let i = 0; i < product.photos.length; i++){
            await cloudinary.uploader.destroy(product.photos[i].public_id);
        }
    }

    req.body.photos = imagesOfProduct;
    // update the product
    product = await Product.findByIdAndUpdate(req.params.id  , req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({ success: true, product });
});

exports.adminDeleteProduct = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new customError(`Product not found with id of ${req.params.id}`, 404));
    }
    // delete the images
    for (let i = 0; i < product.photos.length; i++){
        await cloudinary.uploader.destroy(product.photos[i].public_id);
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product is deleted !' });
});

