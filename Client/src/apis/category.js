import axios from "../axios";
export const apiCreateCategory = (data) => axios({
    url: '/prodCategory/',
    method: 'POST',
    data
})
export const apiGetCategory = (params) => axios({
    url: '/prodCategory/',
    method: 'GET',
    params
})
export const apiUpdateCategorys = (data, prdcId) => axios({
    url: '/prodCategory/' + prdcId,
    method: 'PUT',
    data
})
export const apiDeleteCategory = (prdcId) => axios({
    url: '/prodCategory/' + prdcId,
    method: 'DELETE',

})
