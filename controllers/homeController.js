const bigPromise = require('../middlewares/bigPromise');

exports.home = bigPromise( async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Node.js, Express and MongoDB API'
    });
});

exports.homeDummy = bigPromise( async (req, res) => {
    res.status(200).json({
        success: true,
        message: ' this is dummy Welcome to the Node.js, Express and MongoDB API'
    });
});




