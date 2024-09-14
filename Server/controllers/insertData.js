const Product = require('../models/productModel')
const Category = require("../models/productCategoryModel")
const asyncHandler = require('express-async-handler')
const data = require('../../Data/ecommerce.json')
const slugtify = require('slugify')
const categoryData = require('../../Data/cate_brand')

const fn = async (product) => {
     let price = product?.price.match(/\d/g).join('');
    let processedPrice = 0; // Giá trị mặc định hoặc bỏ qua
    if (Number(price) >= 1000) {
        processedPrice = Math.round(Number(price) / 1000);
    }

    await Product.create({
        title: product?.name + Math.round(Math.random() * 1000) + '',
        slug: slugtify(product?.name),
        description: product?.description,
        brand: product?.brand,
        price: processedPrice, // Sử dụng giá trị đã xử lý
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: 0,
        images: product?.images,
        color: product?.varriants?.find(el => el.label === 'Color')?.varriants?.[0] || null,
        thumb: product?.thumb,
        totalRating: 0,
    })
}
const insertProduct = asyncHandler(async (req, res) => {
    // const response = await Product.create(req.body)
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')

})

const fn2 = async (category) => {
    await Category.create({
        title: category?.title,
        brand: category?.brand,
        image: category?.image
    })
}
const insertCategory = asyncHandler(async (req, res) => {
    // const response = await Product.create(req.body)
    const promises = []
    for (let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Done')

})
module.exports = { insertProduct,insertCategory }