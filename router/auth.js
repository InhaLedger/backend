const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config({path:'../.env'})

exports.auth = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        token = req.cookies.token
        base64Payload = token.split('.')[1];
        payload = Buffer.from(base64Payload, 'base64'); 
        result = JSON.parse(payload.toString())
        uidx = result['useridx']
        return next()
    }
    catch (err) {
        if (error.name === 'TokenExpiredError') {
            console.log('auth TokenExpiredError');
            return res.statusCode(400)
        }
        if (error.name === 'JsonWebTokenError') {
            console.log('JsonWebTokenError');
            return res.statusCode(400)
        }
    }
}