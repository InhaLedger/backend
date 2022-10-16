const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')

const router = express.Router()
const {auth} = require('./auth')
    

router.get('/mysong', auth, (req,res) => {
    songlist = []
    db.query('SELECT mysong FROM cart WHERE user=?',[uidx], (err,data)=> {
        if(err){
            console.log(err)
            return res.sendStatus(400)
        }
        for (var result of data){
            db.query('SELECT * FROM song WHERE no=?',[result.mysong], (err2,data2) => {
                if(err2){
                    console.log(err2)
                    return res.sendStatus(400)
                }
                processed = JSON.parse(JSON.stringify(data2))
                songlist.push(processed[0])
                
                return res.status(200).json(songlist)
            })
        }
    })
    
})



router.post('/mynote', auth, (req,res) => {
    const high = req.body.highNote
    const low = req.body.lowNote
    console.log(high)
    console.log(low)
    try {
        db.query('UPDATE user SET highNote=?, lowNote=? WHERE useridx=?',[high, low, uidx], async(err,data)=> {
            if(err)
                return res.sendStatus(400)
            else
                return res.sendStatus(200)
        })
    }
    catch (err) {
        console.log(error)
        return res.sendStatus(400)
    }
})


// router.get('/mysearch', auth, (req,res) => {
//     const {high, low} = req.body
//     try {
//         db.query('UPDATE user SET highNote=?, lowNote=? WHERE useridx=?',[high, low, uidx], async(err,data)=> {
//             if(err)
//                 return res.sendStatus(400)
//             else
//                 return res.sendStatus(200)
//         })
//     }
//     catch (err) {
//         console.log(error)
//         return res.sendStatus(400)
//     }
// })


module.exports = router