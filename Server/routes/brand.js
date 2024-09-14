const express = require("express")
const router = express.Router()
const brandController = require("../controllers/brandController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], brandController.createNewBrand)
router.get('/', brandController.getAllBrand)
router.put('/:brandId', [verifyAccessToken, isAdmin], brandController.updateBrand)
router.delete('/:brandId', [verifyAccessToken, isAdmin], brandController.deleteBrand)

module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd