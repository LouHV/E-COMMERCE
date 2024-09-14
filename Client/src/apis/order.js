import axios from "axios";

// export const apiGetOrderDetail = (orderId) => axios({
//     url: '/order/detailorder/' + orderId,
//     method: 'GET',
// })
export const apiGetOrderDetail = (orderId) => axios({
    url: '/order/detailorder/' + orderId,
    method: 'GET',
   
})