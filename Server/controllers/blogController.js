const Blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title_blog, description_blog, category } = req.body
    if (!title_blog || !description_blog || !category) throw new Error('missing inputs')
    if (req.file) req.body.image_blog = req.file.path
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createBlog: response ? "Created" : 'Cannot create new Blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    if (req.file) req.body.image_blog = req.file.path
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(blogId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        message: response ? 'Updated' : 'Cannot get Blog'
    })
})

const getAllBlog = asyncHandler(async (req, res) => {
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
                { title_blog: { $regex: queries?.q, $options: 'i' } },
            ]
        }
    }

    const qr = {...restQueries,...queryObject}
    let queryCommand = Blog.find(qr)
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
        const counts = await Blog.find(qr).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            blogs: response ? response : 'Cannot get Blogs'
        })
    }).catch((err) => {
        throw new Error(err.message)
    })

})


const toggleLikeDislike = asyncHandler(async (req, res, field) => {
    const { _id } = req.user;
    const { blogId } = req.params;
    if (!blogId) throw new Error("Missing inputs");
    const blog = await Blog.findById(blogId);
    const oppositeField = field === 'likes' ? 'dislikes' : 'likes';
    const alreadyExistsInOpposite = blog[oppositeField]?.find(el => el.toString() === _id);
    const alreadyExistsInDesired = blog[field]?.find(el => el.toString() === _id);
    let updateOperation = {};

    // If the user has already liked or disliked, remove it first
    if (alreadyExistsInOpposite) {
        updateOperation = { $pull: { [oppositeField]: _id } };
    }

    // If the user has already liked or disliked in the desired field, remove it
    if (alreadyExistsInDesired) {
        updateOperation = { ...updateOperation, $pull: { [field]: _id } };
    } else {
        // Then, add the user's ID to the desired array if it was not already there
        updateOperation = { ...updateOperation, $addToSet: { [field]: _id } };
    }

    const response = await Blog.findByIdAndUpdate(blogId, updateOperation, { new: true });
    return res.json({
        success: response ? true : false,
        result: response
    });
});
const likeBlog = asyncHandler(async (req, res) => {
    return toggleLikeDislike(req, res, 'likes');
});

const dislikeBlog = asyncHandler(async (req, res) => {
    return toggleLikeDislike(req, res, 'dislikes');
});
const excludedFields = 'firstname lastname'
const getBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', excludedFields)
        .populate('dislikes', excludedFields) // lay thong tin nguoi like
    return res.json({
        success: blog ? true : false,
        blog
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const blog = await Blog.findByIdAndDelete(blogId)
    return res.json({
        success: blog ? true : false,
        result: blog || 'Something went wrong'
    })
})

const uploadImagesBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    if (!req.file) throw new Error("Missing inputs")
    const response = await Blog.findByIdAndUpdate(blogId, { image_blog: req.file.path }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'Cannot update images product'
    })
})

module.exports = {
    createNewBlog,
    updateBlog,
    getAllBlog,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadImagesBlog
}