const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const util = require('util')

const router = express.Router()
const {auth} = require('./auth')
const { default: axios } = require('axios')
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
        data = await query2(`select p.*,u.userid,v.upvote,v2.downvote,vtable.already_vote from fixboard as p 
        left join user as u on p.fix_writer = u.useridx
        left join (select boardidx,count(*) as upvote   from votetable where boardtype='fix' and votetype='up' group by boardidx) as v on v.boardidx = p.fixidx
        left join (select boardidx,count(*) as downvote from votetable where boardtype='fix' and votetype='down' group by boardidx) as v2 on v2.boardidx = p.fixidx
        left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='fix' and voter=? group by boardidx) as vtable on vtable.boardidx = p.fixidx`
        ,[uidx])
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
        db.query(`SELECT p.*,u.userid, vtable.already_vote FROM (SELECT * FROM fixboard WHERE fixidx=?) AS p 
        LEFT JOIN user AS u ON p.fix_writer = u.useridx
        left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='fix' and voter=? group by boardidx) as vtable on vtable.boardidx = p.fixidx`
        ,[fixidx,uidx], async(err,data)=> {
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
        topidx = await query2('SELECT fixidx FROM fixboard ORDER BY 1 DESC LIMIT 1',[])
        const fixidx = parseInt(topidx[0]['fixidx']) + 1

        const doWrite = await query2('INSERT INTO fixboard(fix_boardtitle, fix_boardcontent, fix_writer, fix_no, fix_title, fix_singer, fix_composer, fix_lyricist, fix_releasedate, fix_album, fix_imageurl) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [board_title,board_content, uidx,no,title,singer,composer,lyricist,releasedate,album,imageurl])
        
        postdata = { "userId":uidx, "timestamp":Date.now() ,"type":"fixboard" }
        const response = await axios.post("http://211.226.199.46/proposals",postdata)

        if (response.status == 200) {
            const writePropose = await query2('INSERT INTO proposal(proposal_id,proposal_userid,proposal_timeStamp,proposal_type,proposal_boardidx,proposal_status) VALUES (?,?,?,?,?,?) ',
            [response.data.id, response.data.userId,response.data.timeStamp,response.data.type,fixidx,response.data.status])
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


router.post('/fixvote', auth, async (req,res) => {
    const fixidx = req.body.fixidx
    const votetype = req.body.votetype
    try {
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx,votetype) VALUES(?,?,?,?)',[uidx,'fix',fixidx,votetype])
        
        get_proposal = await query2('SELECT * FROM proposal WHERE proposal_type = "fixboard" and proposal_boardidx=?',[fixidx])
        proposalid = get_proposal[0]['proposal_id']

        postdata = { "userId":uidx,"amounts":2.3, "timestamp":Date.now() ,"type":votetype }
        const response = await axios.post("http://211.226.199.46/proposals/"+proposalid+"/fixboard/votes",postdata)

        if (response.status == 200) {
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


module.exports = router