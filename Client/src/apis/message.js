import axios from "../axios";
export const apiCreateMessages = (data) => axios({
    url: '/message/',
    method: 'POST',
    data
})
export const apiGetMessage = (chatId) => axios({
    url: '/message/' + chatId,
    method: 'GET',
})

