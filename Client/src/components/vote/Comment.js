import React, { memo } from 'react'
import avaDF from '../../assets/avatar-default.jpg'
import moment from "moment"
import { renderStartFromNumber } from '../../ultils/helper'

const Comment = ({ avatar, name = 'Anonymous', updatedAt, comment, star }) => {
    return (
        <div className='flex gap-4'>
            <div className='flex-none'>
                <img src={avatar||avaDF} alt='avatar' className='w-[50px] h-[50px] object-cover rounded-full' />
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold'>{name}</h3>
                    <span className='text-xs italic'>{moment(updatedAt)?.fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 pl-4 text-sm mt-4 border border-gray-300 bg-gray-100'>
                    <span className='flex items-center gap-1'>
                        <span className='font-semibold'>Vote:</span>
                        <span
                            className='flex items-center gap-1'>{renderStartFromNumber(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}</span>
                    </span>
                    <span className='flex items-center gap-1'>
                        <span className='font-semibold'>Comment:</span>
                        <span
                            className='flex items-center gap-1'>{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment)