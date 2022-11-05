const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const util = require('util')
const request = require('request')


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
            console.log(data)
            for (var result of data){
                data2 = await query2('SELECT * FROM song WHERE no=?',[result.mysong])
                processed = JSON.parse(JSON.stringify(data2))
                songlist.push(processed[0])
                //console.log(songlist)
            }
            console.log(songlist)
        }
        await run().then(function() {
            console.log('--------------')
            console.log(songlist)
            return res.status(200).send(songlist)
        })
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
        db.query('UPDATE user SET highNote=?, lowNote=? WHERE useridx=?',[high, low, uidx], async(err,data)=> {
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
        data = await query2('SELECT highNote, lowNote FROM user WHERE useridx=?',[uidx])
        console.log('first finish')
        high = data[0].highNote
        low = data[0].lowNote
        console.log(high,low)

        data2 = await query2('SELECT * FROM song WHERE lowNote>=? AND highNote<=?',[low, high])
        console.log('second finish')
        return res.send(JSON.parse(JSON.stringify(data2))).status(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})



router.post('/deletemysong', auth, (req,res) => {
    const mysong = req.body.no
    try {
        db.query('DELETE FROM cart WHERE useridx=? AND mysong=?',[uidx,mysong], async(err,data)=> {
            if(err)
                return res.sendStatus(400)
            else
                db.query('UPDATE song SET star = star - 1 WHERE no=?',[mysong], async(err2,data2) => {
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


router.get('/mywallet', auth, async (req,res) => {
    try {
        // on progress
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})



module.exports = router