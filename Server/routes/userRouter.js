const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getcurrent', verifyAccessToken, userController.getCurrent)
router.post('/refreshtoken', userController.refreshAccessToken)
router.get('/logout', userController.logout)
router.post('/forgotpassword', userController.forgotPassword)
router.put('/resetpassword', userController.resetPassword)
router.put('/changePassword',verifyAccessToken, userController.changePassword)
router.get('/', [verifyAccessToken, isAdmin], userController.getUsers)
router.delete('/:uid', [verifyAccessToken, isAdmin], userController.deleteUser)
router.put('/current', verifyAccessToken, uploader.single('avatar'), userController.updateUser)
router.put('/cart/', [verifyAccessToken], userController.updateCart)
router.delete('/remove-cart/:cartId', [verifyAccessToken], userController.removeProductIncart)
router.put('/address', [verifyAccessToken, isAdmin], userController.updateUserAddress)
router.put('/wishlist/:prdId', [verifyAccessToken], userController.updateWishlist)
router.put('/:uid', userController.updateUserByAdmin)

router.get('/findbyid/:_id', [verifyAccessToken], userController.getUserById)


module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd