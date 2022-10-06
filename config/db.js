const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'coin',
    password: 'inhacoin',
    database: 'inha',
    port: '3306'
})

module.exports = db