import React, { useState, useEffect, useCallback } from 'react'
import { apiCreateChat, apiFindChat, apiFindUserChats } from '../apis/chat';
import { useSelector } from 'react-redux';
import UserChat from '../pages/Chat/userChat';
import { apiCreateMessages, apiGetMessage, apiGetUsers } from '../apis';
import PotentialChats from '../pages/Chat/PotentialChats';
import ChatBox from '../pages/Chat/ChatBox';
import '../main.css';
import { io } from 'socket.io-client'

const ChatContext = () => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatError, setUserChatError] = useState(null)
    const { current } = useSelector(state => state.user)
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    const fetchUserChats = async () => {
        const response = await apiFindUserChats(current._id);
        setIsUserChatsLoading(false)
        if (response.error) {
            return setUserChatError(response)
        }
        setUserChats(response)
    };

    useEffect(() => {
        if (current?._id) {
            setIsUserChatsLoading(true)
            setUserChatError(null)
            fetchUserChats().finally(() => setIsUserChatsLoading(false));
        }
    }, [current]);

    //initial socket
    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect()
        }
    }, [current]);

    //add user online
    useEffect(() => {
        if (socket === null) return
        socket.emit('addNewUser', current?._id)
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res)
        })
        return () => {
            socket.off("getOnlineUsers")
        }
    }, [socket]);

    //send message
    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members.find((id) => id !== current?._id);

        socket.emit('sendMessage', { ...newMessage, recipientId })
    }, [newMessage]);

    //receive message
    useEffect(() => {
        if (socket === null) return;
        socket.on("getMessage", res => {
            if (currentChat?._id !== res.chatId) return
            setMessages((prev) => [...prev, res])

        })

        return () => {
            socket.off("getMessage")
        }
    }, [socket, currentChat]);

    const fetchUsers = async () => {
        const response = await apiGetUsers();
        setIsUserChatsLoading(false)
        if (response.error) {
            return console.log('Error fetching users:', response);
        }
        const pChats = response?.Users?.filter((u) => {
            let isChatCreated = false;
            if (current._id === u._id) return false;
            if (userChats) {
                isChatCreated = userChats?.some((chat) => {
                    return chat.members[0] === u._id || chat.members[1] === u._id;
                })
            }
            return !isChatCreated;
        })
        setPotentialChats(pChats)
    };

    useEffect(() => {
        fetchUsers()
    }, [userChats]);

    const fetchMessages = async () => {
        if (!currentChat?._id) return; // Kiểm tra xem currentChat có tồn tại không
        const response = await apiGetMessage(currentChat?._id);
        setIsMessagesLoading(false)
        if (response.error) {
            return setMessagesError(response)
        }
        setMessages(response)
    };

    useEffect(() => {
        if (!currentChat?._id) return;
        setIsMessagesLoading(true);
        setMessagesError(null);
        fetchMessages().finally(() => setIsMessagesLoading(false));
    }, [currentChat]);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log('You must type somthing...')

        const response = await apiCreateMessages({ chatId: currentChatId, senderId: sender._id, text: textMessage })

        if (response.error) {
            return setSendTextMessageError(response)
        }
        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage('')
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const createChat = useCallback(async (firstId, secondId) => {
        const data = {
            firstId: firstId,
            secondId: secondId
        }
        const response = await apiCreateChat(data)
        console.log('response :>> ', response);
        if (response.error) {
            return console.log('Error creating chat:', response);
        }
        setUserChats((prev) => [...prev, response])
    }, [])

    return (
        <div className="chat w-full h-screen">
            <PotentialChats potentialChats={potentialChats} createChat={createChat} current={current} onlineUsers={onlineUsers} />
            {userChats?.length < 1 ? null : (
                <div className='flex gap-4 items-start'>
                    <div className='flex-grow-0 pr-3 gap-3'>
                        {isUserChatsLoading && <p>Loading chats... </p>}
                        {userChats?.map((chat, index) => (
                            <div className='cursor-pointer' key={index} onClick={() => updateCurrentChat(chat)}>
                                <UserChat chat={chat} user={current} onlineUsers={onlineUsers} />
                            </div>
                        ))}
                    </div>
                    <div className='items-center w-full h-full'>
                        <ChatBox
                            user={current}
                            currentChat={currentChat}
                            messages={messages}
                            isMessagesLoading={isMessagesLoading}
                            sendTextMessage={sendTextMessage} />
                    </div>
                </div>
            )}
        </div>
    )
};

export default ChatContext
