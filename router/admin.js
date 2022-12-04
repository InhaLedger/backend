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
        postdata = {"amounts":amounts,"userId":"admin"}
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


router.get('/admin_finalize', auth, async (req,res) => {
    if (admin == 0)
        return res.sendStatus(401)
    try {
        prog_count = await query2(`select count(*) as prog from proposal where proposal_status='PROGRESS'`,[])
        prog_count = prog_count[0]['prog']

        for (i = 0; i<prog_count; i++) {
            postdata = {"userId":"admin", "timestamp": Date.now(), "rewardPerProposal":20, "batchSize":1}
            const response = await axios.put("http://211.226.199.46/proposals", postdata)
            if (response.status == 200 && atob(response.data)=='1') {
                const propid = await query2(`select proposal_id from proposal where proposal_status='PROGRESS' order by proposal_timeStamp limit 1`,[])
                const done = await query2(`update proposal SET proposal_status='DONE' where proposal_id=?`,[propid[0]['proposal_id']])
            }
            else
                return res.sendStatus(500)
        }
        return res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

module.exports = router