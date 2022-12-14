const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { default: axios } = require('axios')
const util = require('util')

const router = express.Router()
const {auth} = require('./auth')
const query2 = util.promisify(db.query).bind(db)


router.post('/sendcoin', auth, async (req,res) => {
    try {
        const {receiverId, amounts}  = req.body
        postdata = {"senderId":uidx, "senderOrg":"Org1", "receiverId":receiverId, "amounts":amounts}
        const response = await axios.post("http://211.226.199.46/coins", postdata)
        
        if (response.status == 200)
            return res.sendStatus(201)
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})



router.post('/finduser', auth, async (req,res) => {
    try {
        const {userid}  = req.body
        data = await query2('SELECT useridx, userid FROM user WHERE userid like "\%'+userid+'\%"')
        return res.send(data)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

module.exports = router