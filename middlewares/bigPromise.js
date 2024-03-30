// either use try.....catch block or use this middleware to handle promises
//

module.exports = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
}
