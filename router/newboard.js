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
        data = await query2(`select p.*,u.userid,v.vote,vtable.already_vote from newboard as p 
        left join user as u on p.new_writer = u.useridx
        left join (select boardidx,count(*) as vote from votetable where boardtype='new' group by boardidx) as v on v.boardidx = p.newidx
        left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='new' and voter=? group by boardidx) as vtable on vtable.boardidx = p.newidx`,[uidx])
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
        topidx = await query2('SELECT newdix FROM newboard ORDER BY 1 DESC LIMIT 1',[])
        const newidx = parseInt(topidx[0]['newidx']) + 1

        const doWrite = await query2('INSERT INTO newboard(new_boardtitle, new_boardcontent, new_writer, new_no, new_title, new_singer, new_composer, new_lyricist, new_releasedate, new_album, new_imageurl) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [board_title,board_content, uidx,no,title,singer,composer,lyricist,releasedate,album,imageurl])

        postdata = { "userId":uidx, "timestamp":Date.now() ,"type":"newboard" }
        const response = await axios.post("http://211.226.199.46/proposals",postdata)

        if (response.status == 200) {
            const writeid = await query2('UPDATE newboard SET new_proposalid=? WHERE newidx=?',[response.data.id, newidx])
            return res.sendStatus(201)
        }
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.post('/newvote', auth, async (req,res) => {
    const newidx = req.body.newidx
    try {
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx) VALUES(?,?,?)',[uidx,'new',newidx])
        return res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})






module.exports = router