const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cartController")
const { verifyAccessToken } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.get('/detail-cart', [verifyAccessToken], CartController.getCart)
router.post('/add-cart', [verifyAccessToken], CartController.addProductToCart)
router.put('/quantity', [verifyAccessToken], CartController.updateCartQuantity);
router.delete('/delete-cart', [verifyAccessToken], CartController.deleteCart);

router.post('/apply-coupon', [verifyAccessToken], CartController.applyCouponToOrder);


module.exports = router;
