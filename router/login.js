const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const util = require('util')
const axios = require('axios')

const router = express.Router()
const query2 = util.promisify(db.query).bind(db)


    
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
                const isAdmin = data[0].userid=='admin' ? 1 : 0
                const token = jwt.sign({"useridx": data[0].useridx,"isAdmin":isAdmin}, process.env.JWT_SECRET, {
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


router.post('/join', async (req,res) => {
    const { userid, password } = req.body
    if(!userid || !password ){
        return res.sendStatus(400)
    }
    
    try {
        check_dup = await query2('SELECT * FROM user WHERE userid=?', [userid])

        if(check_dup.length != 0){
            return res.sendStatus(400)
        }

        bcrypt.hash(password, 8, async (err,encPassword) => {
            await query2('INSERT INTO user(userid,password) VALUES(?,?)', [userid,encPassword])

            uidx = await query2('SELECT useridx FROM user WHERE userid = ?',[userid])
            postdata = {"orgId":"Org1", "userId":uidx[0]['useridx']}
            const response = await axios.post("http://211.226.199.46/users", postdata)
            console.log(response)
            if (response.status == 204)
                return res.sendStatus(201)
            else
                return res.sendStatus(500)
        })
    
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})


// router.get('/naver', passport.authenticate('naver'));

// router.get('/callback', function (req, res, next) {
//     passport.authenticate('naver', function (err, user) {
//     console.log('passport.authenticate(naver)실행');
//     if (!user) { return res.redirect('http://localhost:3000/login'); }
//     req.logIn(user, function (err) { 
//         console.log('naver/callback user : ', user);
//         return res.redirect('http://localhost:3000/');        
//     });
//     })(req, res);
// });

module.exports = router