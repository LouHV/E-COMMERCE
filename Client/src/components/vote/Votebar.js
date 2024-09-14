import React, { useRef, useEffect, memo } from 'react'
import { BsStarFill } from 'react-icons/bs'

const Votebar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef()
    useEffect(() => {
        const percent = Math.round(ratingCount * 100 / ratingTotal) || 0
        percentRef.current.style.cssText = `right: ${100 - percent}%`
        // const percentBar = percentRef.current

    }, [ratingCount, ratingTotal])
    return (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            <div className='flex flex-1 items-center justify-center gap-1 text-sm'>
                <span>{number}</span>
                <BsStarFill color='orange' />
            </div>
            <div className='flex-8'>
                <div className='w-full relative h-[7px] bg-gray-200 rounded '>
                    <div ref={percentRef} className='absolute inset-0 bg-red-500 rounded'></div>
                </div>
            </div>
            <div className='flex-2'>
                {`${ratingCount || 0} reviewers`}
            </div>
        </div>
    )
}

export default memo(Votebar)