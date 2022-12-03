const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { default: axios } = require('axios')
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
        data = await query2(`select p.*,u.userid,v.upvote,v2.downvote,vtable.already_vote from package as p 
            left join user as u on p.packwriter = u.useridx
            left join (select boardidx,count(*) as upvote   from votetable where boardtype='pack' and votetype='up'   group by boardidx) as v  on v.boardidx  = p.packidx
            left join (select boardidx,count(*) as downvote from votetable where boardtype='pack' and votetype='down' group by boardidx) as v2 on v2.boardidx = p.packidx
            left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='pack' and voter=? group by boardidx) as vtable on vtable.boardidx = p.packidx`
            ,[uidx])
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
        db.query(`select p.*,u.userid, vtable.already_vote from (select * from package where packidx=?) as p 
        left join user as u on p.packwriter = u.useridx
        left join (select boardidx,if(count(voteidx)!=0,true,false) as already_vote from votetable where boardtype='pack' and voter=? group by boardidx) as vtable on vtable.boardidx = p.packidx`
        ,[packidx,uidx], async(err,data)=> {
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
        topidx = await query2('SELECT packidx FROM package ORDER BY 1 DESC LIMIT 1',[])
        const packidx = parseInt(topidx[0]['packidx']) + 1


        const doWrite = await query2('INSERT INTO package(packwriter,packlist,packtitle,packcontent,packprice) VALUES (?,?,?,?,?)',
        [uidx,packlist,title,content,packprice])
        
        postdata = { "userId":uidx, "timestamp":Date.now() ,"type":"packboard" }
        const response = await axios.post("http://211.226.199.46/proposals",postdata)

        if (response.status == 200) {
            const writePropose = await query2('INSERT INTO proposal(proposal_id,proposal_userid,proposal_timeStamp,proposal_type,proposal_boardidx,proposal_status) VALUES (?,?,?,?,?,?) ',
            [response.data.id, response.data.userId,response.data.timeStamp,response.data.type,packidx,response.data.status])
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


router.post('/packvote', auth, async (req,res) => {
    const packidx = req.body.packidx
    const votetype = req.body.votetype
    try {
        do_vote = await query2('INSERT INTO votetable(voter,boardtype,boardidx,votetype) VALUES(?,?,?,?)',[uidx,'pack',packidx,votetype])

        get_proposal = await query2('SELECT * FROM proposal WHERE proposal_type = "packboard" and proposal_boardidx=?',[packidx])
        proposalid = get_proposal[0]['proposal_id']

        postdata = { "userId":uidx,"amounts":2.3, "timestamp":Date.now() ,"type":votetype }
        const response = await axios.post("http://211.226.199.46/proposals/"+proposalid+"/packboard/votes",postdata)

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