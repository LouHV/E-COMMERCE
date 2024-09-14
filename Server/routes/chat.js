const express = require("express")
const router = express.Router()
const chatController = require("../controllers/chatController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], chatController.createChat)
router.get('/:userId', [verifyAccessToken], chatController.findUserChats)
router.get('/find/:firstId/:secondId', [verifyAccessToken], chatController.findChat)

module.exports = router
