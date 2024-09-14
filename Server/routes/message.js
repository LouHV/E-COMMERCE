const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], messageController.createMessage)
router.get('/:chatId', [verifyAccessToken], messageController.getMessage)


module.exports = router
