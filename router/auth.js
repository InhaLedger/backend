const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config({path:'../.env'})

exports.auth = (req, res, next) => {
    try {
        bearerHeader = req.headers['authorization']
        if(typeof bearerHeader == 'undefined')
            return res.sendStatus(401)

        bearer = bearerHeader.split(' ')
        bearerToken = bearer[1]
        req.token = bearerToken

        req.decoded = jwt.verify(req.token, process.env.JWT_SECRET)
        console.log('decode = ',req.decoded)


        base64Payload = req.token.split('.')[1];
        payload = Buffer.from(base64Payload, 'base64'); 
        result = JSON.parse(payload.toString())
        console.log('result = ',result)
        uidx = result['useridx']
        console.log('auth passed')
        return next()
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(401)
    }
}