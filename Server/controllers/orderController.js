const Order = require('../models/oderModel')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")
const Product = require("../models/productModel")
const Carts = require('../models/cart');

const convertToObjectIdMongoDb = require('../ultils/index')
const sendMail = require("../ultils/sendMail")
const asyncHandler = require('express-async-handler')


const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, status, discountedTotal, coupon_code } = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] })
    }
    const data = { products, total, orderBy: _id, coupon_code }
    if (status) data.status = status
    if (discountedTotal) data.discountedTotal = discountedTotal
    const rs = await Order.create(data)
    const orderedProducts = rs.products;
    for (const product of orderedProducts) {
        const productInfo = await Product.findById(product.product);
        const newQuantity = productInfo.quantity - product.quantity;

        // Tăng sold lên
        const newSold = +productInfo.sold + +product.quantity;

        await Product.findByIdAndUpdate(product.product, {
            quantity: newQuantity,
            sold: newSold
        });
    }
    await Carts.deleteOne({ cart_userId: _id });

    if (total - discountedTotal > 0) {
        const coupon = await Coupon.findOne({ coupon_code: coupon_code });
        if (coupon) {
            if (coupon.quantity > 0) {
                const updateCoupon = await Coupon.updateOne({ _id: coupon._id }, { $inc: { quantity: -1 } });
                if (!updateCoupon) throw new Error('Missing Update Coupon');
            }
        }
    }

    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    })
})

const _updateStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing Status');
    const response = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    const user = await User.findOne({ _id: convertToObjectIdMongoDb(response.orderBy).toString() });
    if (!user) throw new Error('missing user');

    const html = `Đơn hàng của bạn đã được cập nhật trạng thái. Xem chi tiết thông tin đơn hàng tại đây: 
    <a href=${process.env.CLIENT_URL}/detailorder/${orderId}>Click here</a>`;

    const email = user.email;
    const data = {
        email,
        html
    }
    const rsSendMail = await sendMail.sendMail2(data)
    if (!rsSendMail) throw new Error('Missing send mail update status order');

    return res.json({
        success: response ? true : false,
        createdOrder: response ? response : 'Something went wrong',
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) throw new Error('Missing Status');

    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (status === 6) {
        for (let product of order.products) {
            const productInDb = await Product.findById(product.product);
            if (!productInDb) throw new Error('Product not found');

            productInDb.quantity += product.quantity;
            await productInDb.save();
        }
    }

    const response = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    const user = await User.findOne({ _id: convertToObjectIdMongoDb(response.orderBy).toString() });
    if (!user) throw new Error('missing user');

    const html = `Đơn hàng của bạn đã được cập nhật trạng thái. Xem chi tiết thông tin đơn hàng tại đây: 
    <a href=${process.env.CLIENT_URL}/detailorder/${orderId}>Click here</a>`;

    const email = user.email;
    const data = {
        email,
        html
    }
    const rsSendMail = await sendMail.sendMail2(data);
    if (!rsSendMail) throw new Error('Missing send mail update status order');

    return res.json({
        success: response ? true : false,
        createdOrder: response ? response : 'Something went wrong',
    })
});


const getUserOder = asyncHandler(async (req, res) => {
    let queryCommand = Order.find();
    const queries = { ...req.query };
    const { _id } = req.user
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);


    const qr = { ...formattedQueries, orderBy: _id }

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
        const response = await queryCommand.find(qr)
        const counts = await Order.countDocuments(qr);
        // console.log('response :>> ', response);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            Orders: response ? response : 'Cannot get Users',
        });
    } catch (err) {
        throw new Error(err.message);
    }
})

const getOders = asyncHandler(async (req, res) => {
    let queryCommand = Order.find();
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries }

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
        const response = await queryCommand.find(qr).populate({
            path: 'orderBy',
            select: 'firstname lastname avatar'
        })
        const counts = await Order.countDocuments(qr);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            Orders: response ? response : 'Cannot get Users',
        });
    } catch (err) {
        throw new Error(err.message);
    }
})
const getOrdersCountByDate = asyncHandler(async (req, res) => {
    const { dateType, dateValue } = req.query; // dateType can be 'day', 'month', or 'year'
    const dateField = dateType === 'day' ? '$date' : dateType === 'month' ? { $month: '$date' } : { $year: '$date' };
    const pipeline = [
        {
            $match: {
                date: {
                    $gte: new Date(dateValue),
                    $lt: new Date(new Date(dateValue).setMonth(new Date(dateValue).getMonth() + 1))
                }
            }
        },
        {
            $group: {
                _id: dateField,
                count: { $sum: 1 }
            }
        }
    ];

    try {
        const response = await Order.aggregate(pipeline);
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (err) {
        throw new Error(err.message);
    }
});


const applyCouponToOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({ coupon_code: couponCode, expiry: { $gte: new Date() } });
    if (!coupon) {
        return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    const order = await Order.findOne({ orderBy: _id, status: 1 });
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let discountedTotal = order.total;
    if (coupon.type_coupon === 'Percent') {
        discountedTotal -= order.total * (coupon.discount / 100);
    } else if (coupon.type_coupon === 'Amount') {
        discountedTotal -= coupon.discount;
    }


    order.total = discountedTotal;
    await order.save();

    return res.status(200).json({ success: true, message: 'Coupon applied successfully', order });
});
const getOrderDetail = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    if (!orderId) throw new Error('Missing Order ID');

    try {
        // Tìm đơn hàng dựa trên ID
        const order = await Order.findById(orderId).populate({
            path: 'orderBy',
            select: 'mobile address'
        })
            .populate({
                path: 'products.product',
                select: 'price'
            })

        if (!order) throw new Error('Order not found');

        // Trả về thông tin chi tiết của đơn hàng
        return res.status(200).json({
            success: true,
            order: order
        });
    } catch (err) {
        throw new Error(err.message);
    }
});

module.exports = {
    createNewOrder,
    updateStatus,
    getUserOder,
    getOders,
    getOrdersCountByDate,
    applyCouponToOrder,
    getOrderDetail
}