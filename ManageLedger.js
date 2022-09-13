const express = require('express')
const router = express.Router()

router.post('/ledger', (req,res) => {
    res.send(req.path)
})

router.get('/:ledgerId', (req,res) => {
    ledgerId = req.params.ledgerId
    res.send(req.path)
})

router.put('/:ledgerId', (req,res) => {
    ledgerId = req.params.ledgerId

    res.send(req.path)
})

router.delete('/:ledgerId', (req,res) => {
    ledgerId = req.params.ledgerId

    res.send(req.path)
})


module.exports = router