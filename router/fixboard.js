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
        data = await query2('SELECT * FROM fixboard',[])
        return res.send(data).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get('/fixread', auth, async (req,res) => {
    const fix_idx = req.query.fix_idx

    try {
        db.query('SELECT * FROM fixboard WHERE fix_idx=?',[fix_idx], async(err,data)=> {
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
    const no = req.body.no
    const title = req.body.title
    const singer = req.body.singer
    const composer = req.body.composer
    const lyricist = req.body.lyricist
    const releasedate = req.body.releasedate
    const album = req.body.album
    const imageurl = req.body.imageurl

    try {
        db.query('INSERT INTO fixboard(fix_writer, fix_no, fix_title, fix_singer, fix_composer, fix_lyricist, fix_releasedate, fix_album, fix_imageurl) VALUES (?,?,?,?,?,?,?,?,?)',
        [uidx,no,title,singer,composer,lyricist,releasedate,album,imageurl], async(err,data)=> {
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
//                 rawUser = await query2('SELECT voteusers FROM fixboard WHERE noteidx=?',[noteidx])
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
//                     update = await query2('UPDATE fixboard SET vote=vote+1, voteusers=? WHERE noteidx=?',[newUser,noteidx])
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