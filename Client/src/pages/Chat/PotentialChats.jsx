import React from 'react';

const PotentialChats = ({ potentialChats, createChat, current, onlineUsers }) => {
    return (
        <div className='all-users flex gap-2'>
            {potentialChats && potentialChats.map((u) => {
                const isOnline = onlineUsers?.some((user) => user?.userId === u?._id);
                return (
                    <div className='single-user cursor-pointer' key={u._id} onClick={() => createChat(current._id, u._id)}>
                        {u.firstname} {u.lastname} 
                        {isOnline && <span className='user-online'></span>}
                    </div>
                );
            })}
        </div>
    );
}

export default PotentialChats;
