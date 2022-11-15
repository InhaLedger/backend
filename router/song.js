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


router.post('/searchsong', auth, async (req,res) => {
    sqllist = []
    
    if (req.body.no!='')
        sqllist.push('no = '+req.body.no)
    if (req.body.title!='')
        sqllist.push('title like \'%'+req.body.title+'%\'')
    if (req.body.singer!='')
        sqllist.push('singer like \'%'+req.body.singer+'%\'')
    if (req.body.album!='')
        sqllist.push('singer like \'%'+req.body.album+'%\'')
    if (req.body.fromdate!='')
        sqllist.push('date_format(song.release, \'%Y\') >='+req.body.fromdate)
    if (req.body.fromdate!='')
        sqllist.push('date_format(song.release, \'%Y\') <='+req.body.todate)

    if (req.body.highNote!='')
        sqllist.push('highNote<='+Notelist.indexOf(req.body.highNote))
    if (req.body.lowNote!='')
        sqllist.push('lowNote>='+Notelist.indexOf(req.body.lowNote))

    const sql = 'SELECT * FROM song where '+sqllist.join(' and ')
    console.log(sql)
    try{
        songlist=[]
        async function run(){
            data = await query2(sql,[])
            for (i = 0; i<data.length;i++){
                data[i].highNote = Notelist[data[i].highNote]
                data[i].lowNote = Notelist[data[i].lowNote]
                songlist.push(data[i])
            }
        }
        await run().then(function() {
            
            return res.status(200).send(songlist)
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
    
})


router.get('/rank', auth, async (req,res) => {
    try {
        data = await query2('select s.*,IF (c.mysong=s.no, true, false) as alreadystar from (select (@rownum := @rownum+1) as rankidx,a.* from (select * from song order by star desc limit 100) as a, (select @rownum := 0 ) as b) as s left join (select * from cart where user=?) as c on s.no = c.mysong;',[uidx])
        return res.send(data).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})





module.exports = router