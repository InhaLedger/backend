const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const util = require('util')
const request = require('request')
const axios = require('axios')


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

router.get('/mysong', auth, async (req,res) => {
    songlist = []
    try{
        async function run(){
            data = await query2('SELECT mysong FROM cart WHERE user=?',[uidx])
            for (var result of data){
                data2 = await query2('SELECT * FROM song WHERE no=?',[result.mysong])
                for (i = 0; i<data2.length;i++){
                    data2[i].highNote = Notelist[data2[i].highNote]
                    data2[i].lowNote = Notelist[data2[i].lowNote]
                    songlist.push(data2[i])
                }
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

router.get('/showmynote', auth, async (req,res) => {
    try{
        data = await query2('SELECT highNote,lowNote FROM user WHERE useridx=?',[uidx])
        data[0].highNote = Notelist[data[0].highNote]
        data[0].lowNote = Notelist[data[0].lowNote]
        return res.status(200).send(data)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.post('/mynote', auth, (req,res) => {
    const high = req.body.highNote
    const low = req.body.lowNote
    const highidx = Notelist.indexOf(high)
    const lowidx = Notelist.indexOf(low)
    try {
        db.query('UPDATE user SET highNote=?, lowNote=? WHERE useridx=?',[highidx, lowidx, uidx], async(err,data)=> {
            if(err)
                return res.sendStatus(400)
            else
                return res.sendStatus(200)
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.get('/mysearch', auth, async (req,res) => {
    high = 1000
    low = 1000
    
    try {
        songlist = []
        data = await query2('SELECT highNote, lowNote FROM user WHERE useridx=?',[uidx])
        high = data[0].highNote
        low = data[0].lowNote

        data2 = await query2('SELECT * FROM song WHERE lowNote>=? AND highNote<=? limit 100',[low, high])
        for (i = 0; i<data2.length;i++){
            data2[i].highNote = Notelist[data2[i].highNote]
            data2[i].lowNote = Notelist[data2[i].lowNote]
            songlist.push(data2[i])
        }

        return res.send(songlist).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})



router.post('/deletemysong', auth, (req,res) => {
    const mysong = req.body.no
    try {
        db.query('DELETE FROM cart WHERE user=? AND mysong=?',[uidx,mysong], async(err,data)=> {
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }
            else
                db.query('UPDATE song SET star = star - 1 WHERE no=?',[mysong], async(err2,data2) => {
                    if(err2){
                        console.log(err)
                        return res.sendStatus(400)
                    }
                    else
                        return res.sendStatus(200)
                })
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.post('/insertmysong', auth, (req,res) => {
    const mysong = req.body.no
    try {
        db.query('INSERT INTO cart(user,mysong) VALUES(?,?)',[uidx,mysong], async(err,data)=> {
            if(err)
                return res.sendStatus(400)
            else
                db.query('UPDATE song SET star = star + 1 WHERE no=?',[mysong], async(err2,data2) => {
                    if(err2)
                        return res.sendStatus(400)
                    else
                        return res.sendStatus(200)
                })  
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.get('/mycoin', auth, async (req,res) => {
    try {
        const response = await axios.get("http://211.226.199.46/users/Org1/"+uidx+"/account")
        if (response.status == 200){
            return res.send(response.data)
        }
        else
            return res.sendStatus(500)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


router.get('/myproposal', auth, async (req,res) => {
    try{
        data = await query2('SELECT * FROM proposal WHERE proposal_userid=?',[uidx])
        return res.status(200).send(data)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


module.exports = router