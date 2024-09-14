'use strict';

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

var cartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active',
    },

    cart_products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        category: String,
        quantity: Number,
        color: String,
        price: Number,
        thumb: String,
        title: String
    }],


    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
}
);

cartSchema.pre('save', function (next) {
    const totalQuantity = this.cart_products.reduce((acc, product) => {
        return acc + (product.quantity || 0);
    }, 0);

    this.cart_count_product = totalQuantity;
    next();
});


module.exports = model(DOCUMENT_NAME, cartSchema);