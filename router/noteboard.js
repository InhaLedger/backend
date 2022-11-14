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


router.get('/noteboard', auth, async (req,res) => {
    try {
        data = await query2('SELECT * FROM noteboard',[])
        return res.send(JSON.parse(JSON.stringify(data))).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get('/noteread', auth, async (req,res) => {
    const noteidx = req.query.noteidx

    try {
        db.query('SELECT * FROM noteboard WHERE noteidx=?',[noteidx], async(err,data)=> {
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }
            else
                return res.send(JSON.parse(JSON.stringify(data))).status(200)
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.post('/notewrite', auth, async (req,res) => {
    const title = req.body.title
    const content = req.body.content
    const no = req.body.no
    const high = req.body.highNote
    const low = req.body.lowNote
    const highidx = Notelist.indexOf(high)
    const lowidx = Notelist.indexOf(low)

    try {
        db.query('INSERT INTO noteboard(note_writer,note_title,note_content,note_no,highNote,lowNote) VALUES (?,?,?,?,?,?)',[uidx,title,content,no,highidx,lowidx], async(err,data)=> {
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


router.post('/notevote', auth, async (req,res) => {
    const noteidx = req.body.noteidx
    try {
            async function run(){
                rawUser = await query2('SELECT voteusers FROM noteboard WHERE noteidx=?',[noteidx])
                isnull = false
                if (rawUser[0]['voteusers'] == null){
                    rawUser[0]['voteusers'] = ''
                    isnull = true
                }
                listUser = rawUser[0]['voteusers'].split(',')
                uidx = uidx.toString()
                if (listUser.indexOf(uidx) != -1)
                    return res.sendStatus(403)
                else{
                    if (!isnull)
                        newUser = rawUser[0]['voteusers']+','+uidx
                    else
                        newUser = uidx
                    update = await query2('UPDATE noteboard SET vote=vote+1, voteusers=? WHERE noteidx=?',[newUser,noteidx])
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