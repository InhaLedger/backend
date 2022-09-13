const express = require('express')
const logger = require('morgan')
const app = express()
const port = process.env.PORT || 3000

app.use(logger('dev'))

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/manage/member', require('./Audit'))
app.use('/', require('./Login'))
/**************************************************************************/

app.use('/manage/member', require('./ManageMember'))
app.get('/manage/members', (req,res) => {
    res.send(req.path)
})

/**************************************************************************/

app.use('/manage/ledger', require('./ManageLedger'))
app.get('/manage/ledgers', (req,res) => {
    res.send(req.path)
})

// ??
app.post('/manage/audits', (req,res) => {
    res.send(req.path)
})

/**************************************************************************/

app.listen(port, () => console.log(`Listening on port ${port}`))