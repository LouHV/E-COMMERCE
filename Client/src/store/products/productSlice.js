import {  createSlice } from "@reduxjs/toolkit";
import * as actions from '../products/asyncActions'

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProduct: null,
    },
    reducers: {
        logout: (state) => {
            state.isLoading = false
        }
    },
    // Code logic xử lý async action
    extraReducers: (builder) => {
        // Bắt đầu thực hiện action login (Promise pending)
        builder.addCase(actions.getNewproducts.pending, (state) => {
            // Bật trạng thái loading
            state.isLoading = true;
        });

        // Khi thực hiện action login thành công (Promise fulfilled)
        builder.addCase(actions.getNewproducts.fulfilled, (state, action) => {
            // Tắt trạng thái loading, lưu thông tin user vào store
            state.isLoading = false;
            state.newProduct = action.payload;
        });

        // Khi thực hiện action login thất bại (Promise rejected)
        builder.addCase(actions.getNewproducts.rejected, (state, action) => {
            // Tắt trạng thái loading, lưu thông báo lỗi vào store
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    }
})
// export const { } = productSlice.actions
export default productSlice.reducer