const express = require("express")
const router = express.Router()
const CouponController = require("../controllers/couponController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], CouponController.createNewCoupon)
router.get('/', CouponController.getCoupon)
router.put('/:couponId', [verifyAccessToken, isAdmin], CouponController.updateCoupon)
router.delete('/:couponId', [verifyAccessToken, isAdmin], CouponController.deleteCoupon)
router.post('/couponByName', CouponController.getCouponByName)


module.exports = router