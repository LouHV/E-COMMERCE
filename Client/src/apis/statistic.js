import axios from "../axios";

export const apiGetRevenueByDay = (params) => axios({
    url: '/statistic/',
    method: 'GET',
    params
})

// export const apiRatings = (data) => axios({
//     url: '/statistic/ratings',
//     method: 'PUT',
//     data
// })
// export const apiCreateProduct = (data) => axios({
//     url: '/statistic/',
//     method: 'POST',
//     data
// })

// export const apiDeleteProduct = (pid) => axios({
//     url: '/statistic/' + pid,
//     method: 'Delete',

// })
