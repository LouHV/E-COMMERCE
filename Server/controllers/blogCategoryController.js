const BlogCategory = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')
const createBlogCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createBlogCategory: response ? response : 'Cannot create new BlogCategory'
    })

})
const getAllBlogCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        BlogCategorys: response ? response : 'Cannot get BlogCategory'
    })
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    const { blogcId } = req.params
    const response = await Blog.findByIdAndUpdate(blogcId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update Blog'
    })
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { blogcId } = req.params
    const response = await Blog.findByIdAndDelete(blogcId)
    return res.json({
        success: response ? true : false,
        deletedBlogCategory: response ? response : 'Cannot delete BlogCategory'
    })
})
module.exports = {
    createBlogCategory,
    getAllBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
}