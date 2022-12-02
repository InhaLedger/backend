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


        base64Payload = req.token.split('.')[1];
        payload = Buffer.from(base64Payload, 'base64'); 
        result = JSON.parse(payload.toString())
        uidx = result['useridx']
        console.log('auth passed')
        admin = result['isAdmin'] == '1' ? true : false
        if (admin)
            console.log('admin passed')
        return next()
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(401)
    }
}