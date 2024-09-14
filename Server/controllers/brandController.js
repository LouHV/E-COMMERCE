const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const createNewBrand = asyncHandler(async (req, res) => {
    const { title } = req.body
    if (!title) throw new Error('missing inputs')
    // kiem tra neu ton tai email tra ra loi
    const user = await Brand.findOne({ title })
    if (user)
        throw new Error("Brand has existed!")
    else {
        const response = await Brand.create(req.body)
        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Brand is successfully' : 'Something went wrong'
        })
    }
})
const getAllBrand = asyncHandler(async (req, res) => {
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
    let queryCommand = Brand.find(qr)
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
        const counts = await Brand.find(qr).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            Brands: response ? response : 'Cannot get Brands'
        })
    }).catch((err) => {
        throw new Error(err.message)
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params
    const response = await Brand.findByIdAndUpdate(brandId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        message: response ? "Updated!" : 'Cannot update Brand'
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params
    const response = await Brand.findByIdAndDelete(brandId)
    return res.json({
        success: response ? true : false,
        message: response ? "Deleted Brand" : 'Cannot delete Brand'
    })
})
module.exports = {
    createNewBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}