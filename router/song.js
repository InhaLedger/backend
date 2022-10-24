const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')

const router = express.Router()
const {auth} = require('./auth')


router.post('/searchsong', auth, (req,res) => {
    const high = req.body.highNote
    const low = req.body.lowNote
    console.log(high)
    console.log(low)
    try {
        db.query('UPDATE user SET highNote=?, lowNote=? WHERE useridx=?',[high, low, uidx], async(err,data)=> {
            if(err)
                return res.sendStatus(400)
            else
                return res.sendStatus(200)
        })
    }
    catch (err) {
        console.log(error)
        return res.sendStatus(400)
    }
})



module.exports = router