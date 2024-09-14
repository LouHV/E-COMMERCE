import axios from "../axios";
export const apiCreateCoupon = (data) => axios({
    url: '/coupon/',
    method: 'POST',
    data
})
export const apiGetCoupon = (params) => axios({
    url: '/coupon/',
    method: 'GET',
    params
})
export const apiUpdateCoupons = (data, cpid) => axios({
    url: '/coupon/' + cpid,
    method: 'PUT',
    data
})
export const apiDeleteCoupon = (cpid) => axios({
    url: '/coupon/' + cpid,
    method: 'DELETE',

})
export const apiApplyCoupon = (data) => axios({
    url: '/cart/apply-coupon/',
    method: 'POST',
    data
})
