'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
        price: Number,
        thumb: String,
        title: String
    }],
    status: {
        type: Number,
        default: '1',
        enum: [1, 2, 3, 4, 5, 6]
    },
    total: Number,
    discountedTotal: Number,
    coupon_code:{ type: String },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', OrderSchema);