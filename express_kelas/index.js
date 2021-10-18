let express = require('express');
let cors = require('cors');
const app = express()
const PORT = 5700
const { authRoute, userRoute, productsRoute } = require('./routes');
const bearerToken = require('express-bearer-token');
// xulqgkepfnoeafbh

// GATAU NAMA
app.use(express.json())
app.use(cors())
app.use(bearerToken())

app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))

// API
app.use("/auth", authRoute)
app.use("/users", userRoute)
app.use("/products", productsRoute)

// API NOT FOUND
app.all("*", (req, res) => {
    return res.status(404).send({ message: "not found" });
});

app.listen(PORT, () => {
    console.log(`Server Jalan di Port ${PORT}`);
})