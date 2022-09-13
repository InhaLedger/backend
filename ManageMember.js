const express = require('express')
const router = express.Router()

router.get('/:memberId', (req,res) => {
    memberId = req.params.memberId
    res.send(req.path)
})

router.delete('/:memberId', (req,res) => {
    memberId = req.params.memberId
    res.send(req.path)
})

router.post('/', (req,res) => {
    res.send(req.path)
})

module.exports = router