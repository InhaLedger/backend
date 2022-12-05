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
            console.log(response)
            console.log(Buffer.from(response.data, "base64").toString('utf-8'))
            if (response.status == 200 ) { //&& Buffer.from(response.data, "base64").toString('utf-8')=='2'
                const prop = await query2(`select * from proposal where proposal_status='PROGRESS' order by proposal_timeStamp limit 1`,[])
                const propdone = await query2(`update proposal SET proposal_status='DONE' where proposal_id=?`,[prop[0]['proposal_id']])
                if (prop[0]['proposal_type'] == 'fixboard') {
                    boarddata = await query2(`select * from fixboard where fixidx=?`,[prop[0]['proposal_boardidx']])
                    rawup = await query2(`select count(*) as up from votetable where boardtype='fix' and boardidx=? and votetype='up'`,[prop[0]['proposal_boardidx']])
                    rawdown = await query2(`select count(*) as down from votetable where boardtype='fix' and boardidx=? and votetype='down'`,[prop[0]['proposal_boardidx']])
                    up = rawup[0]['up'] != undefined ? rawup[0]['up'] : 0
                    down = rawup[0]['down'] != undefined ? rawup[0]['down'] : 0
                    if (up > down) {
                        fix_aciton = await query2(`UPDATE song SET title=?, singer=?, composer=?, lyricist=?, releasedate=?, album=?, imageurl=? where no=?`
                        ,[boarddata[0]['fix_title'], boarddata[0]['fix_singer'], boarddata[0]['fix_composer'], boarddata[0]['fix_lyricist'], boarddata[0]['fix_releasedate'], boarddata[0]['fix_album'], boarddata[0]['fix_imageurl'], boarddata[0]['fix_no']])
                        console.log('fix fixed')
                    }
                }
                else if (prop[0]['proposal_type'] == 'newboard') {
                    boarddata = await query2(`select * from newboard where newidx=?`,[prop[0]['proposal_boardidx']])
                    rawup = await query2(`select count(*) as up from votetable where boardtype='new' and boardidx=? and votetype='up'`,[prop[0]['proposal_boardidx']])
                    rawdown = await query2(`select count(*) as down from votetable where boardtype='new' and boardidx=? and votetype='down'`,[prop[0]['proposal_boardidx']])
                    up = rawup[0]['up'] != undefined ? rawup[0]['up'] : 0
                    down = rawup[0]['down'] != undefined ? rawup[0]['down'] : 0

                    if (up > down) {
                        new_action = await query2(`INSERT INTO song(no,brand,title,singer,composer,lyricist,releasedate,highNote,lowNote,album,imageurl) VALUES(?,'kumyoung',?,?,?,?,?,107,0,?,? )`
                        ,[boarddata[0]['new_no'], boarddata[0]['new_title'], boarddata[0]['new_singer'], boarddata[0]['new_composer'], boarddata[0]['new_lyricist'], boarddata[0]['new_releasedate'], boarddata[0]['new_album'], boarddata[0]['new_imageurl']])
                        console.log('new fixed')
                    }
                }
                else if (prop[0]['proposal_type'] == 'noteboard') {
                    boarddata = await query2(`select * from noteboard where noteidx=?`,[prop[0]['proposal_boardidx']])
                    console.log(boarddata)
                    rawup = await query2(`select count(*) as up from votetable where boardtype='note' and boardidx=? and votetype='up'`,[prop[0]['proposal_boardidx']])
                    rawdown = await query2(`select count(*) as down from votetable where boardtype='note' and boardidx=? and votetype='down'`,[prop[0]['proposal_boardidx']])
                    up = rawup[0]['up'] != undefined ? rawup[0]['up'] : 0
                    down = rawup[0]['down'] != undefined ? rawup[0]['down'] : 0
                    console.log(up,down)
                    if (up > down) {
                        note_action = await query2(`UPDATE song SET highNote=?, lowNote=? where no=?`
                        ,[boarddata[0]['highNote'], boarddata[0]['lowNote'], boarddata[0]['note_no']])
                        console.log(note_action)
                        console.log('note fixed')
                    }
                }
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