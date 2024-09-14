import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis'

export const getCart = createAsyncThunk('cart/carts', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCart()
    if (!response.success) return rejectWithValue(response)
    return response?.cart
})

export const addToCart = createAsyncThunk('cart/addToCart', async (product, { rejectWithValue }) => {
    try {
        console.log("product::XXX", product);
        const response = await apis.addProductToCart(product);
        if (!response.success) {
            return rejectWithValue(response);
        }
        return response.cart;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const updateCartQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity, price }, { rejectWithValue }) => {
    const response = await apis.updateCartQuantity({ productId, quantity, price });
    if (!response.success) return rejectWithValue(response);
    return response?.cart;
});


export const deleteCartProduct = createAsyncThunk('cart/deleteProduct', async ({ productId }, { rejectWithValue }) => {
    const response = await apis.apiDeleteCart({ productId });
    if (!response.success) return rejectWithValue(response);
    return response?.cart;
});
