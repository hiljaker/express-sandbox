let express = require('express');
let cors = require('cors');
let data = require('./data');
const app = express()
const PORT = 5700

// Data
console.log(data.produk);
let id = 4

const logging = (req, res, next) => {
    console.log(req.method, req.url, new Date().toString());
    next()
}

app.use(express.json())
app.use(logging)
app.use(cors())

// verb GET
app.get("/produk/:id", (req, res) => {
    const { id } = req.params
    let indexProduk = data.produk.findIndex(val => val.id == id)
    return res.status(200).send(data.produk[indexProduk])
})

// verb POST
app.post("/produk", (req, res) => {
    let postdata = req.body
    postdata.id = ++id
    data.produk.push(postdata)
    return res.status(200).send(data.produk)
})

// verb PATCH
app.patch("/produk/:id", (req, res) => {
    const { id } = req.params
    let indexProduk = data.produk.findIndex(val => val.id == id)
    let patchdata = data.produk[indexProduk]
    if (indexProduk >= 0) {
        const { nama, harga } = req.body
        if (nama) {
            patchdata.nama = nama
        }
        if (harga) {
            patchdata.harga = harga
        }
        data.produk[indexProduk] = patchdata
        return res.status(200).send(data.produk)
    } else {
        let msg = {
            message: "tidak ada id"
        }
        return res.status(400).send(msg)
    }
})

// verb PUT
app.put("/produk/:id", (req, res) => {
    const { id } = req.params
    let indexProduk = data.produk.findIndex(val => val.id == id)
    let putdata = data.produk[indexProduk]
    if (indexProduk >= 0) {
        const { nama, harga } = req.body
        if (nama) {
            putdata.nama = nama
        } else {
            delete putdata.nama
        }
        if (harga) {
            putdata.harga = harga
        } else {
            delete putdata.harga
        }
        data.produk[indexProduk] = putdata
        return res.status(200).send(data.produk)
    } else {
        let msg = {
            message: "tidak ada id"
        }
        return res.status(400).send(msg)
    }
})

// verb DELETE
app.delete("/produk/:id", (req, res) => {
    const { id } = req.params
    let indexProduk = data.produk.findIndex(val => val.id == id)
    let deletedata = data.produk
    if (indexProduk >= 0) {
        deletedata.splice(indexProduk, 1)
        return res.status(200).send(deletedata)
    } else {
        let msg = {
            message: "tidak ada id"
        }
        return res.status(400).send(msg)
    }
})

app.listen(PORT, () => {
    console.log(`Server Jalan di Port ${PORT}`);
})