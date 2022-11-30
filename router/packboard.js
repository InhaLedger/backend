const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const util = require('util')

const router = express.Router()
const {auth} = require('./auth')
const query2 = util.promisify(db.query).bind(db)

const Note = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const Notelist = []

for (i=0; i<9; i++) {
    Note.forEach((value, index, array) => {
        Notelist.push(value+String(i))
    })
}


router.get('/packboard', auth, async (req,res) => {
    try {
        data = await query2('select p.*,u.userid from package as p left join user as u on p.packwriter = u.useridx',[])
        return res.send(data).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get('/packread', auth, async (req,res) => {
    const packidx = req.query.packidx

    try {
        db.query('select p.*,u.userid as writerid from (select * from package where packidx=?) as p left join user as u on p.packwriter = u.useridx',[packidx], async(err,data)=> {
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }
            else
                return res.send(data).status(200)
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.post('/packwrite', auth, async (req,res) => {
    const packlist = req.body.packlist
    const title = req.body.title
    const content = req.body.content
    const packprice = req.body.packprice

    try {
        db.query('INSERT INTO package(packwriter,packlist,packtitle,packcontent,packprice) VALUES (?,?,?,?,?)',[uidx,packlist,title,content,packprice], async(err,data)=> {
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }
            else
                return res.sendStatus(200)
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.post('/packvote', auth, async (req,res) => {
    const packidx = req.body.packidx
    try {
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx) VALUES(?,?,?)',[uidx,'pack',packidx])

    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})






module.exports = router