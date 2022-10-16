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
        console.log('auth passed')
        return next()
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(401)
    }
}