'use strict';

const convertToObjectIdMongoDb = require('../ultils/index')

const Carts = require('../models/cart')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")
const Product = require("../models/productModel")

const asyncHandler = require('express-async-handler')


const getCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    let cart = await Carts.findOne({ cart_userId: _id });

    if (!cart) {
        cart = new Carts({
            cart_userId: _id,
            cart_state: 'pending',
            cart_products: [],
            cart_count_product: 0,
        });
        await cart.save();
    }

    return res.json({
        success: cart ? true : false,
        cart: cart ? cart : 'Something went wrong'
    })
});

const addProductToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, color, price } = req.body;
    const { _id } = req.user;
    const userId = _id;

    let cart = await Carts.findOne({ cart_userId: userId });
    if (!cart) {
        cart = new Carts({
            cart_userId: userId,
            cart_state: 'active',
            cart_products: [],
            cart_count_product: 0,
        });
    }

    const productIndex = cart.cart_products.findIndex(p => p.product.toString() == productId && p.color === color);
    if (productIndex !== -1) {
        cart.cart_products[productIndex].quantity += quantity;
        cart.cart_products[productIndex].price += price;
    } else {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        cart.cart_products.push({
            product: productId,
            quantity: quantity,
            color: color,
            price: price,
            thumb: product.thumb,
            title: product.title
        });
    }

    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);
    cart.cart_state = 'active';

    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Add Product to cart not found' });
    }

    return res.json({
        success: true,
        cart: rs
    });
});

const updateCartQuantity = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    const { productId, quantity, price } = req.body;

    const cart = await Carts.findOne({ cart_userId: _id });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.cart_products.findIndex(p => {
        return p.product.toString() == convertToObjectIdMongoDb(productId).toString();
    });

    if (productIndex == -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.cart_products[productIndex].quantity = quantity;
    cart.cart_products[productIndex].price = price;
    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);

    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Cart updated successfully' });
    }

    return res.json({
        success: true,
        cart: rs
    });
});

const deleteCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;

    const cart = await Carts.findOne({ cart_userId: _id });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.cart_products.findIndex(p => {
        console.log('p.product.toString() :>> ', p.product.toString());
        console.log('convertToObjectIdMongoDb(productId).toString() :>> ', convertToObjectIdMongoDb(productId).toString());

        return p.product.toString() == convertToObjectIdMongoDb(productId).toString();
    });

    if (productIndex == -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.cart_products.splice(productIndex, 1);
    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);

    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Cart updated successfully' });
    }

    return res.json({
        success: true,
        cart: rs
    });
});

const applyCouponToOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon_code } = req.body;

    const coupon = await Coupon.findOne({ coupon_code, expiry: { $gte: new Date() } });
    if (!coupon) {
        return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.start_date > new Date()) {
        return res.status(400).json({ success: false, message: 'Coupon not yet valid' });
    }

    if (coupon.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Coupon has been used up' });
    }

    const cart = await Carts.findOne({ cart_userId: _id, cart_state: 'active' });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found ...' });
    }

    let discountedTotal = cart.cart_products.reduce((acc, product) => acc + product.price, 0);

    if (coupon.type_coupon === 'Percent') {
        discountedTotal -= discountedTotal * (coupon.discount / 100);
    } else if (coupon.type_coupon === 'Amount') {
        discountedTotal -= coupon.discount;
    } else {
        discountedTotal = discountedTotal;
    }

    return res.json({
        success: true,
        message: 'Coupon applied successfully',
        discountedTotal
    });
});

module.exports = {
    getCart,
    deleteCart,
    addProductToCart,
    updateCartQuantity,
    applyCouponToOrder
}
