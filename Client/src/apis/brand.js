import axios from "../axios";
export const apiCreateBrand = (data) => axios({
    url: '/brandCategory/',
    method: 'POST',
    data
})
export const apiGetBrand = (params) => axios({
    url: '/brandCategory/',
    method: 'GET',
    params
})
export const apiUpdateBrands = (data, bid) => axios({
    url: '/brandCategory/' + bid,
    method: 'PUT',
    data
})
export const apiDeleteBrand = (bid) => axios({
    url: '/brandCategory/' + bid,
    method: 'DELETE',
})
