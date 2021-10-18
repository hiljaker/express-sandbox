const connection = require("../connections/mysqldb");

module.exports = {
    tesUpload: (req, res) => {
        console.log("isi req file :", req.files); //dapetin data file
        console.log("isi req body :", req.body); // dapetin data text
        return res.status(200).send({
            message: "berhasil",
            isireqfile: req.files
        })
    }
};
