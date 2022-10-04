const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config({path:'../.env'})

exports.auth = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
        return next()
    }
    catch (err) {
        if (error.name === 'TokenExpiredError') {
            console.log('auth TokenExpiredError');
            next();
        }
        if (error.name === 'JsonWebTokenError') {
            console.log('JsonWebTokenError');
            next()
    }
}