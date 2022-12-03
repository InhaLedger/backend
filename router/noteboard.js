const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const util = require('util')
const { default: axios } = require('axios')

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
        data = await query2(`select n.*,s.title,s.singer,v.upvote,v2.downvote,vtable.already_vote from (select p.*,u.userid from noteboard as p left join user as u on p.note_writer = u.useridx) as n 
        left join (select * from song) as s on n.note_no = s.no
        left join (select boardidx,count(*) as upvote   from votetable where boardtype='note' and votetype='up' group by boardidx) as v on v.boardidx = n.noteidx
        left join (select boardidx,count(*) as downvote from votetable where boardtype='note' and votetype='down' group by boardidx) as v2 on v2.boardidx = n.noteidx
        left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='note' and voter=? group by boardidx) as vtable on vtable.boardidx = n.noteidx`
        ,[uidx])

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
        db.query(`select p.*,u.userid,vtable.already_vote from (select * from noteboard where noteidx=?) as p 
        left join user as u on p.note_writer = u.useridx
		left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='note' and voter=? group by boardidx) as vtable on vtable.boardidx = p.noteidx`
        ,[noteidx,uidx], async(err,data)=> {
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
        topidx = await query2('SELECT noteidx FROM noteboard ORDER BY 1 DESC LIMIT 1',[])
        const noteidx = parseInt(topidx[0]['noteidx']) + 1

        const doWrite = await query2('INSERT INTO noteboard(note_writer,note_title,note_content,note_no,highNote,lowNote) VALUES (?,?,?,?,?,?)',
        [uidx,title,content,no,highidx,lowidx])

        postdata = { "userId":uidx, "timestamp":Date.now() ,"type":"noteboard" }
        const response = await axios.post("http://211.226.199.46/proposals",postdata)

        if (response.status == 200) {
            const writePropose = await query2('INSERT INTO proposal(proposal_id,proposal_userid,proposal_timeStamp,proposal_type,proposal_boardidx,proposal_status) VALUES (?,?,?,?,?,?) ',
            [response.data.id, response.data.userId,response.data.timeStamp,response.data.type,noteidx,response.data.status])
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


router.post('/notevote', auth, async (req,res) => {
    const noteidx = req.body.noteidx
    const votetype = req.body.votetype
    try {
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx,votetype) VALUES(?,?,?,?)',[uidx,'note',noteidx,votetype])

        get_proposal = await query2('SELECT * FROM proposal WHERE proposal_type = "noteboard" and proposal_boardidx=?',[noteidx])
        proposalid = get_proposal[0]['proposal_id']

        postdata = { "userId":uidx,"amounts":2.3, "timestamp":Date.now() ,"type":votetype }
        const response = await axios.post("http://211.226.199.46/proposals/"+proposalid+"/noteboard/votes",postdata)

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