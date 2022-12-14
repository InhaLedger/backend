const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const http = require('http')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const { swaggerUi, specs } = require('./swagger')


dotenv.config({path:'./.env'})

const app = express()
const port = process.env.PORT || 3000

const dbName = 'inha'

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
/**************************************************************************/

app.use('/', require('./router/login'))
app.use('/', require('./router/mypage'))
app.use('/', require('./router/song'))
app.use('/', require('./router/packboard'))
app.use('/', require('./router/noteboard'))
app.use('/', require('./router/newboard'))
app.use('/', require('./router/fixboard'))
app.use('/', require('./router/coin'))
app.use('/', require('./router/admin'))
/**************************************************************************/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.listen(port, () => console.log(`Listening on port ${port}`))