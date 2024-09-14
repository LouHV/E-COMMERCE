import axios from "../axios";

export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'POST',
    data
})

export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'POST',
    data
})
export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'POST',
    data
})
export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'PUT',
    data
})
export const apiGetcurrent = () => axios({
    url: '/user/getcurrent',
    method: 'GET',
})
export const apiFindUsersById = (uid) => axios({
    url: '/user/findbyid/' + uid,
    method: 'GET',
})
export const apiGetUsers = (params) => axios({
    url: '/user/',
    method: 'GET',
    params
})
export const apiUpdateUsers = (data, uid) => axios({
    url: '/user/' + uid,
    method: 'Put',
    data
})
export const apiChangePassUser = (data) => axios({
    url: '/user/changePassword',
    method: 'Put',
    data
})

export const apiDeleteUsers = (uid) => axios({
    url: '/user/' + uid,
    method: 'Delete',

})
export const apiUpdateCurrent = (data) => axios({
    url: '/user/current',
    method: 'Put',
    data
})

export const apiUpdateWishlist = (pid) => axios({
    url: '/user/wishlist/' + pid,
    method: 'Put',
})
export const apiUpdateCart = (data) => axios({
    url: '/user/cart/',
    method: 'Put',
    data
})
// export const apiDeleteCart = (cartId) => axios({
//     url: '/user/remove-cart/' + cartId,
//     method: 'DELETE',
// })
