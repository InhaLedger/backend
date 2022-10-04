const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const passport = require('passport')
const { swaggerUi, specs} = require('./swagger')

dotenv.config({path:'./.env'})

const app = express()
const port = process.env.PORT || 3000

const dbName = 'inha'

app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

/**************************************************************************/
app.use('/', require('./server/login'))

/**************************************************************************/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.listen(port, () => console.log(`Listening on port ${port}`))