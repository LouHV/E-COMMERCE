import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BreadcrumbsBlog } from "../../components";
import { LuDot } from "react-icons/lu";
import { apiDislikeBlog, apiGetBlogs, apiGetDetailBlog, apiLikeBlog } from '../../apis';
import { format, parseISO } from 'date-fns';
import { FaArrowLeftLong } from "react-icons/fa6";
import withBase from '../../hocs/withBase';
import { AiFillDislike, AiOutlineLike, AiOutlineDislike, AiFillLike } from "react-icons/ai";
import { getBlogs } from '../../store/blogs/asyncActions';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { formatNumber } from '../../ultils/helper';
import DOMPurify from 'dompurify';

const DetailBlogs = ({ navigate, dispatch }) => {
    const { bid, title } = useParams()
    const [blog, setBlog] = useState(null)
    const { current } = useSelector(state => state.user)
    const uId = current?._id

    const isMounted = useRef(true);
    console.log('isMounted :>> ', isMounted);

    const fetchBlogData = async () => {
        const response = await apiGetDetailBlog(bid)
        if (response.success) {
            setBlog(response.blog)
        }
    }

    useEffect(() => {
        if (bid) {
            fetchBlogData()
        }

    }, [])


    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'LIKE') {
            const response = await apiLikeBlog(bid)
            if (response.success) {
                dispatch(getBlogs())
                fetchBlogData()
            } else {
                toast.error(response.message)
            }

        }
        if (flag === 'DISLIKE') {
            const response = await apiDislikeBlog(bid)
            if (response.success) {
                dispatch(getBlogs())
                fetchBlogData()
            } else {
                toast.error(response.message)
            }

        }
    }


    return (
        <div className='w-full'>
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold text-lg uppercase">{title}</h3>
                    <BreadcrumbsBlog title={title} />
                </div>
            </div>

            <div className='flex flex-col w-main m-auto mb-6'>
                <div className=' text-gray-400 text-sm mb-[15px] mt-[15px] flex '>
                    <span>{`By ${blog?.author_blog}`}</span>

                    <span className='ml-2'> {blog?.createdAt ? format(parseISO(blog?.createdAt), 'MMM dd, yyyy') : 'N/A'}</span>
                    <span className='ml-2'>{`Views: ${blog?.numberViews}`}</span>
                </div>
                <img src={blog?.image_blog} className='w-full min-h-[780px] mb-5' />
                <span className='mb-5'>
                    
                   
                    {blog?.description_blog?.length > 1 && <div
            className="text-sm cursor-pointer"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.description_blog) }}></div>}
                    </span>


                <div className='flex w-main m-auto gap-4 my-4 items-center '>
                    <span className='cursor-pointer flex gap-2 '
                        onClick={(e) => handleClickOptions(e, 'LIKE')}>
                        {blog?.likes?.some((i) => i._id === uId)
                            ? <AiFillLike size={25}
                                color='blue'
                            />
                            : <AiOutlineLike
                                size={25}
                            />
                        }
                        {formatNumber(blog?.likes?.length)}
                    </span>
                    <span className='text-xl'>
                        |
                    </span>
                    <span
                        className='cursor-pointer flex gap-2'
                        onClick={(e) => handleClickOptions(e, 'DISLIKE')}>
                        {blog?.dislikes?.some((i) => i._id === uId)
                            ? <AiFillDislike size={25}
                                color='red'
                            />
                            : <AiOutlineDislike
                                size={25}
                            />
                        }
                        {formatNumber(blog?.dislikes?.length)}
                    </span>
                </div>
                <div>
                    <span className='flex items-center gap-2 justify-end hover:text-main cursor-pointer '
                        onClick={e => navigate(`/blogs`)}
                    ><FaArrowLeftLong />Back to Blogs</span>
                </div>


            </div>

        </div>
    )
}

export default withBase(DetailBlogs)