import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis'

export const getNewproducts = createAsyncThunk('product/newProduct', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetProducts({sort: '-createdAt'})
    if (!response.success) return rejectWithValue(response)
    return response.products
})