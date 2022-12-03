const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { default: axios } = require('axios')
const util = require('util')

const router = express.Router()
const {auth} = require('./auth')
const query2 = util.promisify(db.query).bind(db)



router.get('/admin_mycoin', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    try {
        const response = await axios.get("http://211.226.199.46/users/Org1/admin/account")
        if (response.status == 200){
            return res.send(response.data)
        }
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})



router.post('/admin_sendcoin', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    try {
        const {receiverId, amounts}  = req.body
        postdata = {"senderId":"admin", "senderOrg":"Org1", "receiverId":receiverId, "amounts":amounts}
        const response = await axios.post("http://211.226.199.46/coins", postdata)
        
        if (response.status == 200)
            return res.sendStatus(200)
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.post('/admin_blockuser', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    try {
        const {userid}  = req.body
        const response = await axios.delete("http://211.226.199.46/users/Org1/"+userid)
        
        if (response.status == 204)
            return res.sendStatus(200)
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})




router.post('/admin_issuecoin', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    try {
        const {amounts}  = req.body
        postdata = {"amounts":amounts}
        const response = await axios.post("http://211.226.199.46/coins/new", postdata)
        
        if (response.status == 200)
            return res.sendStatus(200)
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.get('/admin_proposal', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    try{
        data = await query2('SELECT * FROM proposal',[])
        return res.status(200).send(data)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.post('/admin_finalize', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    // try {
    //     const {amounts}  = req.body
    //     postdata = {"amounts":amounts}
    //     const response = await axios.post("http://211.226.199.46/coins/new", postdata)
        
    //     if (response.status == 204)
    //         return res.sendStatus(201)
    //     else
    //         return res.sendStatus(500)
    // }
    // catch (err) {
    //     console.log(err)
    //     return res.sendStatus(400)
    // }
})

module.exports = router