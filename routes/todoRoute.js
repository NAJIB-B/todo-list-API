const express = require("express")

const {protect} = require("../controllers/authController")

const router = express.Router()

router.route("/").get(protect)




module.exports = router
