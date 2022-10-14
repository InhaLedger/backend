const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')

const router = express.Router()
const {auth} = require('./auth')
    

router.get('/mysong', auth, (req,res) => {
    db.query('SELECT mysong FROM cart WHERE useridx=?',[uidx], (err,data)=> {
        if(err)
            return res.sendStatus(400)
        
        songlist = []
        for (i=0;  i<data.length; i++){
            db.query('SELECT * FROM song WHERE no=?',[data[i]], (err2,data2 => {
                if(err2)
                    return res.sendStatus(400)
                songlist.push(data2)
            }))
        }

        return res.send(songlist)
    })
    
})



router.post('/mynote', auth, (req,res) => {
    const {high, low} = req.body
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