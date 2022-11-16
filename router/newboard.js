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


router.get('/newboard', auth, async (req,res) => {
    try {
        data = await query2('select p.*,u.userid from newboard as p left join user as u on p.new_writer = u.useridx;',[])
        return res.send(data).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get('/newread', auth, async (req,res) => {
    const newidx = req.query.newidx

    try {
        db.query('select p.*,u.userid from (select * from newboard where newidx=?) as p left join user as u on p.new_writer = u.useridx',[newidx], async(err,data)=> {
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

router.post('/newwrite', auth, async (req,res) => {
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
        db.query('INSERT INTO newboard(new_boardtitle, new_boardcontent, new_writer, new_no, new_title, new_singer, new_composer, new_lyricist, new_releasedate, new_album, new_imageurl) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
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


// router.post('/newvote', auth, async (req,res) => {
//     const noteidx = req.body.noteidx
//     try {
//             async function run(){
//                 rawUser = await query2('SELECT voteusers FROM newboard WHERE noteidx=?',[noteidx])
//                 isnull = false
//                 if (rawUser[0]['voteusers'] == null){
//                     rawUser[0]['voteusers'] = ''
//                     isnull = true
//                 }
//                 listUser = rawUser[0]['voteusers'].split(',')
//                 uidx = uidx.toString()
//                 if (listUser.indexOf(uidx) != -1)
//                     return res.sendStatus(403)
//                 else{
//                     if (!isnull)
//                         newUser = rawUser[0]['voteusers']+','+uidx
//                     else
//                         newUser = uidx
//                     update = await query2('UPDATE newboard SET vote=vote+1, voteusers=? WHERE noteidx=?',[newUser,noteidx])
//                     return res.sendStatus(200)
//                 }
//             }
//         await run()
//     }
//     catch (err) {
//         console.log(err)
//         return res.sendStatus(400)
//     }
// })






module.exports = router