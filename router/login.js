const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')

const router = express.Router()

    
router.post('/login', (req,res) => {
    const { userid, password } = req.body
    if(!userid || !password ){
        return res.sendStatus(400)
    }
    try {
        db.query('SELECT * FROM user WHERE userid=?',[userid], async(err,data)=> {
            if(err)
                return res.sendStatus(400)

            if(data.length != 1)
                return res.sendStatus(401)
            
            else if(userid == data[0].userid && (await bcrypt.compare(password, data[0].password))) {
                const token = jwt.sign({useridx: data[0].useridx}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                console.log('Issued Token is '+token)
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('token',token, cookieOptions)
                res.status(200).send({'token':token})
            }
            else
                return res.sendStatus(401)
        })
    }
    catch (err) {
        console.log(error)
        return res.sendStatus(400)
    }
})


router.post('/join', (req,res) => {
    const { userid, password } = req.body
    if(!userid || !password ){
        return res.sendStatus(400)
    }
    
    db.query('SELECT * FROM user WHERE userid=?', [userid], (err,data) => {
        if(err) {
            console.log(err)
            return res.sendStatus(400)
        }
        
        if(data.length != 0){
            return res.sendStatus(400)
        }
        bcrypt.hash(password, 8, (err,encPassword) => {
            console.log(`encPassword : ${encPassword}`)
            db.query('INSERT INTO user(userid,password) VALUES(?,?)', [userid,encPassword], (err, data) => {
                if(err){
                    return res.sendStatus(400)
                }
                else{
                    return res.sendStatus(201)
                }
            })
        })
    })
})


module.exports = router