const express = require("express")
const router = express.Router()
const insertController = require("../controllers/insertData")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/', insertController.insertProduct)
router.post('/cate', insertController.insertCategory)


module.exports = router