const express = require("express")
const router = express.Router()
const blogController = require("../controllers/blogController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.get('/', blogController.getAllBlog)
router.post('/', [verifyAccessToken, isAdmin], uploader.single('image_blog'), blogController.createNewBlog)
router.get('/one/:blogId', blogController.getBlog)
router.put('/likes/:blogId', [verifyAccessToken], blogController.likeBlog)
router.put('/uploadimage/:blogId', [verifyAccessToken,isAdmin],uploader.single('images') , blogController.likeBlog)
router.put('/dislike/:blogId', [verifyAccessToken], blogController.dislikeBlog)
router.put('/:blogId', [verifyAccessToken, isAdmin], uploader.single('image_blog'), blogController.updateBlog)
router.delete('/:blogId', [verifyAccessToken, isAdmin], blogController.deleteBlog)


module.exports = router