import { createSlice } from '@reduxjs/toolkit';
import * as actions from '../cart/asyncActions'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        getCart: (state, action) => {
            state.cart = action.payload;
        },
        addToCart: (state, action) => {
            const productExists = state.cart.cart_products.find(product => product.productId === action.payload.productId);
            if (productExists) {
                productExists.price += action.payload.price;
                productExists.quantity += action.payload.quantity;
                state.cart.cart_count_product += action.payload.quantity;
            } else {
                state.cart.cart_products.push(action.payload);
                state.cart.cart_count_product += action.payload.quantity;
            }
        },
        updateQuantity: (state, action) => {
            const productIndex = state.cart.cart_products.findIndex(p => p.product.toString() === action.payload.productId);
            if (productIndex !== -1) {
                // state.cart.cart_products[productIndex].price = state.cart.cart_products[productIndex].price * action.payload.quantity / state.cart.cart_products[productIndex].quantity;

                state.cart.cart_products[productIndex].price = action.payload.price;
                state.cart.cart_products[productIndex].quantity = action.payload.quantity;
                state.cart.cart_count_product = state.cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);
            }
        },
        removeProduct: (state, action) => {
            const productIndex = state.cart.cart_products.findIndex(p => p.product.toString() === action.payload.productId);
            if (productIndex !== -1) {
                state.cart.cart_products.splice(productIndex, 1);
                state.cart.cart_count_product = state.cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(actions.getCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(actions.getCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(actions.getCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(actions.addToCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(actions.addToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(actions.addToCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(actions.updateCartQuantity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(actions.updateCartQuantity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(actions.updateCartQuantity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(actions.deleteCartProduct.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(actions.deleteCartProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(actions.deleteCartProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export const { getCart, addToCart, updateQuantity, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
