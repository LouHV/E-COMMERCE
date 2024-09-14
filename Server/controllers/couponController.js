const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async (req, res) => {
    const { name_coupon, coupon_code, discount, expiry, quanity, start_date } = req.body;
    if (!name_coupon || !coupon_code || !discount || !expiry || !start_date) throw new Error('Missing inputs');

    // Convert start_date to a Date object
    const startDate = new Date(start_date);

    // Calculate the expiry date by adding the expiry duration to the start_date
    const expiryDate = new Date(startDate.getTime() + expiry * 24 * 60 * 60 * 1000);

    const response = await Coupon.create({
        ...req.body,
        expiry: expiryDate,
        start_date: startDate
    });

    return res.json({
        success: response ? true : false,
        message: response ? "Created new coupon!" : 'Cannot create new Coupon'
    });
})

const getCoupon = asyncHandler(async (req, res) => {

    let queryCommand = Coupon.find();
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

    if (queries?.name_coupon) {
        formattedQueries.name_coupon = { $regex: queries.name_coupon, $options: 'i' };
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    const page = +req.query.page || 1; // Dấu + sẽ chuyển STRING sang number
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    try {
        const response = await queryCommand.find(formattedQueries).select('-createdAt -updatedAt').exec();
        const counts = await Coupon.countDocuments(formattedQueries);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            Coupons: response ? response : 'Cannot get Users',
        });
    } catch (err) {
        throw new Error(err.message);
    }
})

const getCouponByName = asyncHandler(async (req, res) => {
    const { coupon_code } = req.body;
    if (!coupon_code) throw new Error('Missing coupon_code');

    try {
        const coupon = await Coupon.findOne({ coupon_code: { $regex: coupon_code, $options: 'i' } });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        return res.status(200).json({
            success: true,
            coupon
        });
    } catch (err) {
        throw new Error(err.message);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body.expiry) req.body.expiry = req.body.expiry
    const response = await Coupon.findByIdAndUpdate(couponId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        message: response ? 'Updated Coupon' : 'Cannot update coupon'
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params
    const response = await Coupon.findByIdAndDelete(couponId)
    return res.json({
        success: response ? true : false,
        message: response ? 'Deleted this coupon!' : 'Cannot delete coupon'
    })
})



module.exports = {
    createNewCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponByName
}