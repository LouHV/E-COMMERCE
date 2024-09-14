import React, { memo } from 'react'
import clsx from 'clsx'
const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity, fullWidth }) => {
    return (
        <div className={clsx('flex items-center w-1/4', fullWidth && 'w-full')}>
            <span onClick={() => handleChangeQuantity('minus')} className='px-[10px] py-[10px]  cursor-pointer border hover:bg-gray-200'>-</span>
            <input className='py-2 outline-none w-[40px] text-center'
                type='text'
                value={quantity}
                onChange={e => handleQuantity(e.target.value)} />
            <span onClick={() => handleChangeQuantity('plus')} className='px-[10px] py-[10px] cursor-pointer border hover:bg-gray-200 '>+</span>
        </div>
    )
}

export default memo(SelectQuantity)