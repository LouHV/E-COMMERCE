const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CouponSchema = new mongoose.Schema({
    name_coupon: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    coupon_code: { type: String, required: true },
    discount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    type_coupon: {
        type: String,
        default: 'Percent',
        enum: ['Percent', 'Amount']
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Coupon', CouponSchema);