import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: '/product/',
    method: 'GET',
    params
})

export const apiGetroduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'GET',
})

export const apiRatings = (data) => axios({
    url: '/product/ratings',
    method: 'PUT',
    data
})
export const apiCreateProduct = (data) => axios({
    url: '/product/',
    method: 'POST',
    data
})
export const apiUpdateProducts = (data, pid) => axios({
    url: '/product/' + pid,
    method: 'Put',
    data
})
export const apiDeleteProduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'Delete',

})
export const apiAddVarriant = (data, pid) => axios({
    url: '/product/varriant/' + pid,
    method: 'PUT',
    data
})
export const apiCreateOrder = (data) => axios({
    url: '/order/',
    method: 'Post',
    data
})
export const apiGetOrders = (params) => axios({
    url: '/order/admin/',
    method: 'Get',
    params
})
export const apiGetUserOrders = (params) => axios({
    url: '/order/',
    method: 'Get',
    params
})

export const apiGetCart = () =>
    axios({
        url: '/cart/detail-cart',
        method: 'Get',
    })

export const addProductToCart = (data) => axios({
    url: '/cart/add-cart',
    method: 'Post',
    data
})

export const updateCartQuantity = (data) => axios({
    url: '/cart/quantity',
    method: 'Put',
    data
})

export const apiDeleteCart = (data) => axios({
    url: '/cart/delete-cart',
    method: 'Delete',
    data
})

export const apiApplyCouponToOrder = (data) => axios({
    url: '/cart/apply-coupon',
    method: 'Post',
    data
})

export const createPayment = (data) => axios({
    url: '/payment/create-payment',
    method: 'Post',
    data
})

export const createPaymentQrCode = (data) => axios({
    url: '/payment/create-payment-qrcode',
    method: 'Post',
    data
})

// export const createPayment = (data) => axios({
//     url: '/payment/create-payment',
//     method: 'Post',
//     data
// })