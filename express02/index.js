let express = require('express');
let cors = require('cors');
let dotenv = require('dotenv');
const mysql = require('mysql2');
const app = express()
const PORT = 1800

// Request Log
const logging = (req, res, next) => {
    console.log(req.method, req.url, new Date().toString());
    next()
}

// Gatau Namanya
app.use(express.json())
app.use(logging)
app.use(cors())
dotenv.config()

// Connection to Database
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

// GET ALL USERS DATA
app.get("/users", async (req, res) => {
    const { username, password } = req.query
    let inputQuery = []
    let sql = `select * from user `
    let msc = connection.promise()
    try {
        if (username) {
            inputQuery[0] = username
            sql += `where username = ? `
        }
        if (password) {
            inputQuery[1] = password
            sql += `and password = ?`
        }
        let [results] = await msc.query(sql, inputQuery)
        return res.status(200).send(results)
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
})

// GET USERS DATA BY ID
app.get("/users/:id", async (req, res) => {
    const { id } = req.params
    let sql = `select * from user where id = ${id}`
    let msc = connection.promise()
    try {
        let [results] = await msc.query(sql)
        return res.status(200).send(results)
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
})

// POST
app.post("/users", async (req, res) => {
    const { username, password, address } = req.body
    if (!username || !password || !address) {
        return res.status(400).send({ message: `tidak valid` })
    }
    let sql = `insert into user set ?`
    let msc = connection.promise()
    try {
        let postData = {
            username,
            password,
            address
        }
        await msc.query(sql, postData)
        sql = `select * from user`
        let [results] = await msc.query(sql)
        return res.status(200).send(results)
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server bekerja di PORT ${PORT}`);
})