const express = require("express")
const router = express.Router()
const blogCategoryController = require("../controllers/blogCategoryController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], blogCategoryController.createBlogCategory)
router.get('/', blogCategoryController.getAllBlogCategory)
router.put('/:blogcId', [verifyAccessToken, isAdmin], blogCategoryController.updateBlogCategory)
router.delete('/:blogcId', [verifyAccessToken, isAdmin], blogCategoryController.deleteBlogCategory)

module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd