const express = require('express')
const router = express.Router()


// 감사내역 삭제  
router.post('/', (req,res) => {
    res.send(req.path)
})

// 감사내역 수정
router.get('/:auditId', (req,res) => {
    auiditId = req.params.auditId

    res.send(req.path)
})

// 감사내역 조회 (단건)
router.post('/:auditId', (req,res) => {
    auiditId = req.params.auditId

    res.send(req.path)
})

// 감사내역 추가
router.delete('/:auditId', (req,res) => {
    auiditId = req.params.auditId

    res.send(req.path)
})

module.exports = router