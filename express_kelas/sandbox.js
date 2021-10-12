let express = require('express');
let cors = require('cors');
let dotenv = require('dotenv')
// let data = require('./express01/data');
const app = express()
const PORT = 5700
// const mysql = require("mysql");
const mysql = require("mysql2");

let id = 4

dotenv.config()

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

const logging = (req, res, next) => {
    console.log(req.method, req.url, new Date().toString());
    next()
}

app.use(express.json())
app.use(logging)
app.use(cors())

app.get("/login", (req, res) => {
    const { username, password } = req.query
    if (!username || !password) {
        return res.status(400).send({ message: `mana username dan pw` })
    }
    let sql = `select * from user where username = ? and password = ?`
    // if (username) {
    //     sql += `where username = ${connection.escape(username)}`
    // }
    // if (password) {
    //     sql += ` and password = ${connection.escape(password)}`
    // }

    // if (username) {
    //     input[0] = username
    //     sql += `where username = ?`
    // }
    // if (password) {
    //     input[1] = password
    //     sql += ` and password = ? `
    // }
    // console.log(sql);
    connection.query(sql, [username, password], (err, results) => {
        if (err) {
            console.log(`error : ${err}`)
            return res.status(500).send({ message: err.message })
        }
        // console.log(`results : `, results);
        // console.log(`fields : `, fields);
        return res.status(200).send(results)
    })
})

// 
app.post("/users", async (req, res) => {
    console.log(req.body);
    const { username, password, alamat } = req.body
    if (!username || !password || !alamat) {
        return res.status(400).send({ message: "kurrrang" })
    }
    let sql = "insert into set ?"
    try {
        let dataInsert = {
            username: username,
            password: password,
            address: alamat
        }
        const [results] = await connection.promise().query(sql, dataInsert)
        console.log(results);
        sql = `select * from user `
        const [userData] = await connection.promise().query(sql)
        return res.status(200).send(userData)
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message })
    }


    // Cara SQL1

    // const { username, password, alamat } = req.body
    // if (!username || !password || !alamat) {
    //     return res.status(400).send({ message: "kurrrang" })
    // }
    // let sql = "insert into set ?"
    // let dataInsert = {
    //     username: username,
    //     password,
    //     address: alamat
    // }
    // connection.query(sql, dataInsert, (err, results) => {
    //     if (err) {
    //         console.log(`error : ${err}`)
    //         return res.status(500).send({ message: err.message })
    //     }
    //     console.log(results);
    //     sql = "select * from user"
    //     connection.query(sql, (err, userData) => {
    //         if (err) {
    //             console.log("error : ", err);
    //             return res.status(500).send({ message: err.message })
    //         }
    //         return res.status(200).send(userData)
    //     })
    // })
})

app.get(`/users`, (req, res) => {
    const { username, password } = req.query
    let sql = `select * from user `
    if (username) {
        sql += `where username = ${connection.escape(username)}`
    }
    if (password) {
        sql += ` and password = ${connection.escape(password)}`
    }

    let input = []
    if (username) {
        input[0] = username
        sql += `where username = ?`
    }
    if (password) {
        input[1] = password
        sql += ` and password = ? `
    }
    console.log(sql);
    connection.query(sql, (err, results, fields) => {
        if (err) {
            console.log(`error : ${err}`)
            return res.status(500).send({ message: err.message })
        }
        // console.log(`results : `, results);
        // console.log(`fields : `, fields);
        return res.status(200).send(results)
    })
})

app.delete("users/:iduser", (req, res) => {
    const { iduser } = req.params
    let sql = "delete from user where id = ?"
    connection.query(sql, [iduser], (err, res1) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: err.message })
        }
        if (!res1.length) {
            return res.status(500).send({ message: err.message })
        }
        sql = "select * from user"
        connection.query(sql, [iduser], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: err.message })
            }
            console.log(results);
            sql = `select * from user `
            connection.query(sql, (err, userData) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: err.message })
                }
                return res.status(200).send(userData)
            })
        })
    })
})

app.put("/users/:iduser", (req, res) => {
    const { username, password, address } = req.body
    const { iduser } = req.params
    let sql = `select id from user where id = ?`
    connection.query(sql, [iduser], (err, results1) => {
        if (err) {
            console.log("error :", err);
            return res.status(500).send({ message: err.message });
        }
        if (!results1.length) {
            return res.status(500).send({ message: "id tidak ditemukan" });
        }
        let dataUpdate = {
            username,
            password,
            address,
        };
        sql = `update user set ? where id = ?`;
        connection.query(sql, [dataUpdate, iduser], (err, results) => {
            if (err) {
                console.log("error :", err);
                return res.status(500).send({ message: err.message });
            }
            console.log(results);
            sql = `select * from user `;
            connection.query(sql, (err, userData) => {
                if (err) {
                    console.log("error :", err);
                    return res.status(500).send({ message: err.message });
                }
                return res.status(200).send(userData);
            });
        });
    })
})

app.get("/users", async (req, res) => {
    // ? cara mysql2 dengan promise
    let sql = `select * from user  `;
    let connMysql = connection.promise();
    try {
        let [results] = await connMysql.query(sql); // connmysql.query itu hasil promisnya adalah array dimana array 1 adlah result ,array 2 itu field
        console.log(results);
        return res.status(200).send(results);
    } catch (err) {
        console.log("error :", err);
        return res.status(500).send({ message: err.message });
    }

    // ?cara promise promisify

    // let sql = `select * from user `;
    // try {
    //   let results = await connDb(sql);
    //   console.log(results);
    //   return res.status(200).send(results);
    // } catch (error) {
    //   console.log("error :", err);
    //   return res.status(500).send({ message: err.message });
    // }
    // cara callback dengan mysql1
    // console.log("query user", req.query);
    // let sql = `select * from user `;
    // connection.query(sql, (err, results) => {
    //   if (err) {
    //     console.log("error :", err);
    //     return res.status(500).send({ message: err.message });
    //   }
    //   // console.log('lewat 102') bisa digunakan untuk cek error
    //   // console.log("results :", results); // selalu array of object
    //   return res.status(200).send(results);
    // });
});

app.post("/auth/register", async (req, res) => {
    const { username, password } = req.body
    const connDb = connection.promise()
    try {
        let sql = `select * from user where username = ?`
        let [dataUser] = await connDb.query(sql, [username])
        if (dataUser.length) {
            throw { message: "username sudah ada" }
        }
        sql = `insert into user set ?`
        let dataInsert = {
            username,
            password
        }
        let [results] = await connDb.query(sql, [dataInsert])
        console.log(results.insertId);
        sql = `select * from user where id = ?`
        let [resDataUser] = await connDb.query(sql, [results.insertId])
        return res.status(200).send(resDataUser)
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server Jalan di Port ${PORT}`);
})