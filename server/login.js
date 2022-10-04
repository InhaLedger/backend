const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mysql = require('../config/db')

const router = express.Router()

router.get('/login', (req,res)=> {
    res.render('login')
})

router.post('/login', (req,res,next) => {
    const { id, password } = req.body
    if(!id || !password ){
        return res.status(400).render('login', {
            message: 'ID와 Password 모두 입력해주세요'
        })
    }

    try {
        conn.query('SELECT * FROM user WHERE id=?',[id],(err,data)=> {
            if(id == data[0].id){
                const token = jwt.sign({id: data[0].id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                console.log('Issued Token is '+token)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/")
            }
        })
    }
    catch (e) {
        console.log(e)
    }
})

router.get('/join', (req,res) => {
    res.render('join')
})

router.post('/join', (req,res) => {
    const { id, passwords } = req.body
    try {
        user = conn.query('SELECT * FROM user WHERE id=?', [id], (err,data) => {
            if(data.length != 0)
                res.render('join',{message:'중복된 ID가 존재합니다.'})

            let encPassword = bcrypt.hash(password, 8)
            
            conn.query('INSERT INTO user SET VALUES(?,?)', [id,encPassword], (err, data) => {
                if(err)
                    console.log(err)
                else{
                    return res.status(200).redirect('login')
                }
            })
        })
    }
    catch(e){
        console.log(e)
    }

})


router.get('/logout', (req,res) => {
    req.session.destroy()
})

module.exports = router