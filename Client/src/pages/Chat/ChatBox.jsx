import React, { useEffect, useRef, useState } from 'react'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient'
import { Stack } from 'react-bootstrap'
import moment from 'moment';
import InputEmoji from 'react-input-emoji'
import { IoIosSend } from "react-icons/io";
const ChatBox = ({ isMessagesLoading, messages, currentChat, user, sendTextMessage }) => {
    const { recipientUser } = useFetchRecipientUser(currentChat, user)
    const [textMessage, setTextMessage] = useState('')
    const scroll = useRef()
    useEffect(() => { scroll.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])


    if (!recipientUser)
        return (
            <p className='align-center w-full'>
                No conversation selected yet...
            </p>
        )
    if (isMessagesLoading)
        return (
            <p className='align-center'>
                Loading Chat...
            </p>
        )
    // Tìm tin nhắn gần nhất của người gửi và người nhận
    const latestMessages = messages.reduce((acc, message) => {
        if (message.senderId === user?._id) {
            if (!acc.user || moment(message.createdAt).isAfter(moment(acc.user.createdAt))) {
                acc.user = message;
            }
        } else if (message.senderId === recipientUser?._id) {
            if (!acc.recipient || moment(message.createdAt).isAfter(moment(acc.recipient.createdAt))) {
                acc.recipient = message;
            }
        }
        return acc;
    }, { user: null, recipient: null });


    return (
        <Stack className='chat-box gap-4 h-full'>
            <div className='chat-header '>
                <strong>
                    {recipientUser?.firstname} {recipientUser?.lastname}
                </strong>
            </div>

            <Stack gap={3} className='messages flex-col'>
                {messages && messages.map((message) => (
                    <div key={message._id} className={`${message.senderId === user?._id ? "abc flex" : "flex"}`}>
                        <div
                            className={`${message.senderId === user?._id
                                ? "message self flex-grow-0 my-3 "
                                : "message align-self-start flex-grow-0 my-3"}`}
                            ref={scroll}>
                            <span className='flex'>{message.text}</span>
                            {(
                                (message.senderId === user?._id && message === latestMessages.user) ||
                                (message.senderId === recipientUser?._id && message === latestMessages.recipient)
                            ) && (
                                    <span className='block text-xs text-gray-500'>{moment(message.createdAt).format('DD/MM/YYYY')}</span>
                                )}
                        </div>
                    </div>
                ))}
            </Stack>


            <Stack direction='horizontal' gap={3} className='chat-input flex-grow-0 flex items-center bottom-0'>
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily='nunito'
                    borderColor='rgba(72,112,223,0.2)' />
                {textMessage.length > 0 &&
                    <IoIosSend size={25} onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)} />
                }
            </Stack>
        </Stack>
    )
}

export default ChatBox