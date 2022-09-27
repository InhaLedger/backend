const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const passportConfig = require('')

const app = express()
const port = process.env.PORT || 3000

const dbName = 'inha'
const DB_URI = process.env.MONGO_CONNECTION_URI || `mongodb://127.0.0.1:27017/${dbName}`

app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

/**************************************************************************/
app.use('/', require('./server/login'))

/**************************************************************************/



app.listen(port, () => console.log(`Listening on port ${port}`))