const express = require('express')
const router = express.Router()


router.post('/login', (req,res) => {
    res.send(req.path)
})

router.post('/join', (req,res) => {
    res.send(req.path)
})


module.exports = router