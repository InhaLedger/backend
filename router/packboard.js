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
        data = await query2('SELECT * FROM package',[])
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
        db.query('SELECT * FROM package WHERE packidx=?',[packidx], async(err,data)=> {
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
            async function run(){
                rawUser = await query2('SELECT voteusers FROM package WHERE packidx=?',[packidx])

                if (rawUser[0]['voteusers'] == null)
                    rawUser[0]['voteusers'] = ''

                listUser = rawUser[0]['voteusers'].split(',')
                uidx = uidx.toString()
                if (listUser.indexOf(uidx) != -1)
                    return res.sendStatus(403)
                else{
                    newUser = rawUser[0]['voteusers']+','+uidx
                    update = await query2('UPDATE package SET vote=vote+1, voteusers=? WHERE packidx=?',[newUser,packidx])
                    return res.sendStatus(200)
                }
            }
        await run()
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})






module.exports = router