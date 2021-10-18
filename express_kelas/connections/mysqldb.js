const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createConnection({
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'sandbox'
});

connection.connect((err) => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

module.exports = connection
