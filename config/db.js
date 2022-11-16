const mysql = require('mysql')

const db = mysql.createConnection({
    host: '3.34.189.21',
    user: 'coin',
    password: 'inhacoin',
    database: 'inha',
    port: '3306'
})

module.exports = db