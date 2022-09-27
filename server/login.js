const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()


SECRET_KEY = '1'

router.post('/login', (req,res) => {
    const { id, password } = req.body

    

    console.log()
    token = jwt.
    
    
    res.send(req.path)
})

router.post('/join', (req,res) => {
    const { id, password, nickname } = req.body

    try {
        user = 
    }
    

    res.send(req.path)
})


router.get('/logout', (req,res) => {

})

module.exports = router