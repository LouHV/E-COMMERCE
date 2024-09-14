'use strict';

const Order = require("../models/oderModel");
const asyncHandler = require("express-async-handler");

const getRevenueByDay = asyncHandler(async (req, res) => {
    try {
        const day = req.params.day;
        let startDate;
        let endDate;

        switch (day) {
            case '7':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '14':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 14);
                break;
            case '6':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '12':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            case 'custom':
                startDate = new Date(req.query.startDate);
                endDate = new Date(req.query.endDate);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return res.status(400).json({ success: false, message: 'Invalid startDate or endDate' });
                }
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid day parameter' });
        }

        let revenueData;
        if (day === '6' || day === '12') {
            revenueData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        status: { $in: [1, 2, 3, 4, 5] }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m", date: "$createdAt" }
                        },
                        totalRevenue: { $sum: "$discountedTotal" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        time: "$_id",
                        revenue: "$totalRevenue"
                    }
                }
            ]);
        } else if (day === 'custom') {
            revenueData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate },
                        status: { $in: [1, 2, 3, 4, 5] }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        totalRevenue: { $sum: "$discountedTotal" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        time: "$_id",
                        revenue: "$totalRevenue"
                    }
                }
            ]);
        } else {
            revenueData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        status: { $in: [1, 2, 3, 4, 5] }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        totalRevenue: { $sum: "$discountedTotal" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        time: "$_id",
                        revenue: "$totalRevenue"
                    }
                }
            ]);
        }

        return res.status(200).json({
            success: true,
            data: revenueData
        });
    } catch (error) {
        throw res.status(400).json({
            success: false,
            message: "Error: " + error.message
        });
    }
});

module.exports = {
    getRevenueByDay
}