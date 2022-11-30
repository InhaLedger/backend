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


router.get('/fixboard', auth, async (req,res) => {
    try {
        data = await query2('select p.*,u.userid from fixboard as p left join user as u on p.fix_writer = u.useridx;',[])
        return res.send(data).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get('/fixread', auth, async (req,res) => {
    const fixidx = req.query.fixidx

    try {
        db.query('select p.*,u.userid from (select * from fixboard where fixidx=?) as p left join user as u on p.fix_writer = u.useridx',[fixidx], async(err,data)=> {
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

router.post('/fixwrite', auth, async (req,res) => {
    const board_title = req.body.board_title
    const board_content = req.body.board_content

    const no = req.body.no
    const title = req.body.title
    const singer = req.body.singer
    const composer = req.body.composer
    const lyricist = req.body.lyricist
    const releasedate = req.body.releasedate
    const album = req.body.album
    const imageurl = req.body.imageurl

    try {
        db.query('INSERT INTO fixboard(fix_boardtitle, fix_boardcontent, fix_writer, fix_no, fix_title, fix_singer, fix_composer, fix_lyricist, fix_releasedate, fix_album, fix_imageurl) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [board_title,board_content, uidx,no,title,singer,composer,lyricist,releasedate,album,imageurl], async(err,data)=> {
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


router.post('/newvote', auth, async (req,res) => {
    const fixidx = req.body.fixidx
    try {
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx) VALUES(?,?,?)',[uidx,'fix',fixidx])

    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


module.exports = router