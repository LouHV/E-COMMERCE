import React, { memo } from 'react'
import icons from '../../ultils/icons'

const { MdEmail } = icons

const Footer = () => {
  return (
    <div className='w-full'>

      <div className='h-[50px] bg-main w-full flex items-center justify-center'>
        <div className='w-main flex items-center justify-between'>
          
        </div>
      </div>
      <div className='h-[407px] bg-gray-950 w-full flex items-center justify-center text-white text-[13px]'>
        <div className='w-main flex '>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>ABOUT US</h3>
            <span>
              <span>Address: </span>
              <span className='opacity-70'>180 Trieu Khuc</span>
            </span>
            <span>
              <span>Phone: </span>
              <span className='opacity-70'>(+84)0869319205</span>
            </span>
            <span>
              <span>Gmail: </span>
              <span className='opacity-70'>lviet13zx@gmail.com</span>
            </span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>INFORMATION</h3>
            <span>Typography</span>
            <span>Gallery</span>
            <span>Store Location</span>
            <span>Today's Deals</span>
            <span>Contacts</span>
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>WHO WE ARE</h3>
            <span>Help</span>
            <span>Free shipping</span>
            <span>FAWs</span>
            <span>Return & Exchange</span>
            <span>Testimonials</span>
          </div>
          <div className='flex-1'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>#DIGITALWORLDSTOR</h3>
          </div>
        </div>
      </div>


    </div>
  )
}

export default memo(Footer)