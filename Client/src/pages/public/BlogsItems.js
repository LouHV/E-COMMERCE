import React from 'react'
import withBase from '../../hocs/withBase'
import { format } from 'date-fns';
import { FaArrowRightLong } from "react-icons/fa6";
import { truncateString } from '../../ultils/helper';
import DOMPurify from 'dompurify';



const BlogsItems = ({ el, dispatch, navigate }) => {
  return (
    <div className='w-full flex h-full mb-[30px]'>
      <div className=' min-w-[420px] min-h-[280px] '>
        <img src={el?.image_blog} className='w-[420px] h-[280px] object-cover cursor-pointer'
          onClick={e => navigate(`/blogs/${el?._id}/${el?.title_blog}`)} />
      </div>
      <div className='min-w-[420px] pl-[20px] flex flex-col mb-[15px] '>
        <span className='uppercase font-bold text-xl cursor-pointer hover:text-main'
          onClick={e => navigate(`/blogs/${el?._id}/${el?.title_blog}`)}
        >{el?.title_blog}</span>
        <div className='text-gray-400 text-sm  mb-[15px]   mt-[15px] '>
          <span>{`By ${el?.author_blog}`}</span>
          <span className='ml-2'>{`${format(el?.createdAt, 'MMM dd, yyyy')}`}</span>
        </div>
        <span className=' mb-[15px] '>
          {/* {el?.description_blog?.length > 1 &&
            <div key={el} className=" leading-6 list-disc cursor-pointer"
              title={el?.description_blog}
            >{truncateString(el?.description_blog, 250)}</div>} */}
          {el?.description_blog?.length > 1 && <div
            className="text-sm cursor-pointer"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateString(el?.description_blog, 250)) }}></div>}
          {/* {truncateString(el?.description_blog, 250)} */}
        </span>
        <span className='flex items-center text-main gap-2 hover:text-black cursor-pointer'
          onClick={e => navigate(`/blogs/${el?._id}/${el?.title_blog}`)}>Read More
          <FaArrowRightLong />
        </span>
      </div>
    </div>
  )
}

export default withBase(BlogsItems)