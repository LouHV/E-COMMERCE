import React, { useEffect, useState } from "react";
import { Breadcrumbs, Pagination } from "../../components";
import { useSelector } from "react-redux";
import { apiGetBlogs } from "../../apis";
import withBase from "../../hocs/withBase";
import { getBlogs } from "../../store/blogs/asyncActions";
import BlogsItems from "./BlogsItems";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
const Blogs = ({ dispatch, navigate }) => {


    const [topblog, setTopblog] = useState(null);


    const [params] = useSearchParams()

    const [blogs, setBlogs] = useState(null)
    const [counts, setCounts] = useState(0)
    const fectchBlog = async (params) => {
        const response = await apiGetBlogs({ sort: '-createdAt', ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) {
            setBlogs(response)
            setCounts(response.counts)
        }
    }

    const fectchBlogs = async () => {
        const response = await apiGetBlogs({ sort: '-createdAt', limit: 3 })
        if (response.success) setTopblog(response);
    };
    useEffect(() => {
        fectchBlogs()
        dispatch(getBlogs())
    }, [])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])

        fectchBlog(searchParams)
    }, [params])
    console.log('topblog :>> ', topblog);
    console.log('blogs :>> ', blogs);
    return (
        <div className="w-full">
            <div className='h-[50px] flex justify-center items-center bg-gray-100 mb-[20px]'>
                <div className="w-main">
                    {/* <h3 className='font-semibold uppercase'>My  Cart</h3> */}
                    <Breadcrumbs />
                </div>
            </div>
            <div className="w-main mx-auto grid grid-cols-10 gap-4">
                <div className="m-auto col-span-7">
                    {blogs?.blogs?.map(el => (
                        <BlogsItems el={el} key={el.id} />
                    ))}
                </div>
                <div className="col-span-3  ">
                    <div className="flex h-[50px] border bg-main w-full justify-start items-center text-white gap-2 p-4">
                        <span className="text-2xl font-bold">RECENT ARTICLES</span>
                    </div>
                    <div className="border p-[20px]">

                        {topblog?.blogs?.map(el => (
                            <div el={el} key={el.id} className="">
                                <span className=" text-lg hover:text-main cursor-pointer"
                                    onClick={e => navigate(`/blogs/${el?._id}/${el?.title_blog}`)}
                                >{el?.title_blog}</span>
                                <div className='text-gray-400 text-sm mb-[20px] mt-[8px] '>
                                    <span className=''>{`${format(el?.createdAt, 'MMM dd, yyyy')}`}</span>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
                {blogs?.blogs?.length > 0 && <div className=" w-main m-auto my-4 flex justify-center">
                    <Pagination
                        totalCount={blogs?.counts}
                    />
                </div>}
            </div>

        </div>
    )
}
export default withBase(Blogs)