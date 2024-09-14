import axios from "../axios";
export const apiCreateChat = (data) => axios({
    url: '/chats/',
    method: 'POST',
    data
})
export const apiFindUserChats = (userId) => axios({
    url: '/chats/' + userId,
    method: 'GET',
})
export const apiFindChat = (firstId, secondId) => axios({
    url: '/chats/find/' + firstId + '/' + secondId,
    method: 'GET',
    
})
