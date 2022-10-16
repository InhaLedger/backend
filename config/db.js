const mysql = require('mysql')

const db = mysql.createConnection({
    host: '52.79.214.156',
    user: 'coin',
    password: 'inhacoin',
    database: 'inha',
    port: '3306'
})

module.exports = db