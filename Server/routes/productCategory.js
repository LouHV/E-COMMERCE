const express = require("express")
const router = express.Router()
const productCategoryController = require("../controllers/productCategoryController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.post('/', [verifyAccessToken, isAdmin],uploader.single('image'), productCategoryController.createCategory)
router.get('/', productCategoryController.getAllCategory)
router.put('/:prdcId', [verifyAccessToken, isAdmin],uploader.single('image'), productCategoryController.updateCategory)
router.delete('/:prdcId', [verifyAccessToken, isAdmin], productCategoryController.deleteCategory)

module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd