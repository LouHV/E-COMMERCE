'use strict';

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloundinary.config');

router.post('/', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), productController.createProduct);
router.get('/', productController.getAllProduct); 
// :valueSearch?
router.put('/ratings', verifyAccessToken, productController.ratings);

router.put('/varriant/:prdId', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), productController.addVarriant)
router.put('/:prdId', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), productController.updateProduct)
router.delete('/:prdId', [verifyAccessToken, isAdmin], productController.deleteProduct)
router.get('/:prdId', productController.getProduct)
router.put('/uploadimage/:prdId', [verifyAccessToken, isAdmin], uploader.array('files', 10), productController.uploadImagesPrd)


module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd