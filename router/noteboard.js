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
        data = await query2(`select n.*,s.title,s.singer,v.vote,vtable.already_vote from (select p.*,u.userid from noteboard as p left join user as u on p.note_writer = u.useridx) as n 
        left join (select * from song) as s on n.note_no = s.no
        left join (select boardidx,count(*) as vote from votetable where boardtype='note' group by boardidx) as v on v.boardidx = n.noteidx
        left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='note' and voter=40 group by boardidx) as vtable on vtable.boardidx = n.noteidx`,[uidx])

        for (i = 0; i<data.length;i++){
            data[i].highNote = Notelist[data[i].highNote]
            data[i].lowNote = Notelist[data[i].lowNote]
        }
        return res.send(data).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get('/noteread', auth, async (req,res) => {
    const noteidx = req.query.noteidx

    try {
        db.query('select p.*,u.userid as writerid from (select * from noteboard where noteidx=?) as p left join user as u on p.note_writer = u.useridx',[noteidx], async(err,data)=> {
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }
            else{
                for (i = 0; i<data.length;i++){
                    data[i].highNote = Notelist[data[i].highNote]
                    data[i].lowNote = Notelist[data[i].lowNote]
                }
                return res.send(data).status(200)
            }
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
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx) VALUES(?,?,?)',[uidx,'note',noteidx])
        return res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


module.exports = router