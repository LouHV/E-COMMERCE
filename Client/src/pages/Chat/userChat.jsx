import React from 'react'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import avartar from '../../assets/avatar-default.jpg'

const UserChat = ({ chat, user, onlineUsers }) => {

  const { recipientUser } = useFetchRecipientUser(chat, user)

  const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)
  return (
    <div className='flex items-center p-2 justify-between'>
      <div className='mr-2'>
        <img className='h-[100px] w-[100px] rounded-full object-contain border my-[20px]' src={recipientUser?.avatar || avartar} />
      </div>
      <div className='flex w-full mr-6'>
        <div className='flex flex-col'>
          <div className='name'>{recipientUser?.firstname} {recipientUser?.lastname}</div>
          <div className='text'>Text Message</div>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <div className='date'>
          20/11/2002
        </div>
        <div className='this-user-notifications'>
          2
        </div>
        <span className={isOnline ? 'user-online' : ""}></span>
      </div>
    </div>
  )
}

export default UserChat
