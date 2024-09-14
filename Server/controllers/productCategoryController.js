const ProductCategory = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')
const createCategory = asyncHandler(async (req, res) => {
    if (req.file) req.body.image = req.file.path;
    // Chuyển đổi chuỗi thành mảng
    const brandArray = req.body.brand.split(',');

    // Lưu mảng vào req.body hoặc thực hiện các thao tác khác với mảng
    req.body.brand = brandArray;

    const response = await ProductCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        message: response ? "Created" : 'Cannot create new Product-category'
    });
});
const getAllCategory = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])
    //format operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const restQueries = JSON.parse(queryString)
    let queryObject = {}
    if (queries?.q) {
        delete restQueries.q
        queryObject = {
            $or: [
                { title: { $regex: queries?.q, $options: 'i' } },
            ]
        }
    }

    const qr = {...restQueries,...queryObject}
    let queryCommand = ProductCategory.find(qr)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    //Filed limiting
    if (req.query.fields) {

        const fields = req.query.fields.split(',').join(' ')

        queryCommand = queryCommand.select(fields)
    }
   
    //Pagination
    //limit la so object lay ve trong 1 api
    //skip: 
    const page = +req.query.page || 1 // Dau + se chuyen STRING sang number
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    queryCommand.then(async (response) => {
        const counts = await ProductCategory.find(qr).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            productCategory: response ? response : 'Cannot get ProductCategorys'
        })
    }).catch((err) => {
        throw new Error(err.message)
    })
  
})

const updateCategory = asyncHandler(async (req, res) => {
    const { prdcId } = req.params
    if (req.file) req.body.image = req.file.path;
    // Chuyển đổi chuỗi thành mảng
    const brandArray = req.body.brand.split(',');
    // Lưu mảng vào req.body hoặc thực hiện các thao tác khác với mảng
    req.body.brand = brandArray;
    const response = await ProductCategory.findByIdAndUpdate(prdcId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        message: response ? 'Updated category' : 'Cannot update Product-category'
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { prdcId } = req.params
    const response = await ProductCategory.findByIdAndDelete(prdcId)
    return res.json({
        success: response ? true : false,
        message: response ? 'deleted category' : 'Cannot delete Product-category'
    })
})
module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}