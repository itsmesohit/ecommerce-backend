const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

//regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookie parser middleware and fileupload middleware
app.use(cookieParser());
app.use(fileupload(
    {
        useTempFiles: true,
        tempFileDir: '/tmp/'
    }
));






// morgan middleware
app.use(morgan('tiny'));




// import all routes here
const home = require('./routes/home');
const user  = require('./routes/user');
const produt = require('./routes/product');
const payment = require('./routes/payment');
const order = require('./routes/order');


// use routes here
app.use('/api/v1', home);
app.use('/api/v1/', user);
app.use('/api/v1/', produt);
app.use('/api/v1/', payment);
app.use('/api/v1/', order);


module.exports = app;
