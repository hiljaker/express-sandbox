const express = require("express");
const { tesUpload } = require("../controllers/productController");
const productController = require("../controllers/productController");
const { verifyToken, uploader } = require("../helpers");
const { verifyTokenAccess } = require("../helpers/verifyToken");
const router = express.Router()

const uploadfile = uploader("/tes", "TES").fields([
    {name: "tes", maxCount: 3}
])

router.post("/tesupload", uploadfile, tesUpload)

module.exports = router