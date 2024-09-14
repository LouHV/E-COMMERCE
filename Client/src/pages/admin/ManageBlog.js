import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import InputForm from '../../components/input/inputForm';
import { formatMoney, formatPrice, truncateString } from '../../ultils/helper';
import moment from 'moment';
import { Pagination } from '../../components';
import useDebounce from '../../hooks/useDebounce';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UpdateBlog from './UpdateBlog'
import { apiDeleteBlog, apiGetBlogs } from '../../apis';
import { MdDeleteForever } from 'react-icons/md'
import { FaRegEdit } from 'react-icons/fa'
import DOMPurify from 'dompurify';
const ManageBlog = () => {
  const [editBlog, setEditBlog] = useState(null);


  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
  const [blogs, setBlogs] = useState(null)
  const [counts, setCounts] = useState(0)
  const handleSearchBlogs = (data) => {

  }

  const fectchBlogs = async (params) => {
    const response = await apiGetBlogs({ ...params, limit: process.env.REACT_APP_LIMIT })
    if (response.success) {
      setBlogs(response.blogs)
      setCounts(response.counts)
    }
  }

  const queryDecounce = useDebounce(watch('q'), 800)


  //search
  useEffect(() => {
    if (queryDecounce) {

      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDecounce }).toString()
      })
    } else {
      navigate({
        pathname: location.pathname
      })
    }
  }, [queryDecounce])
  //nosear
  useEffect(() => {
    const searchParams = Object.fromEntries([...params])

    fectchBlogs(searchParams)
  }, [params])



  const handldeDeleteBlog = (bid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: 'Are you ready remove this blog?',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await apiDeleteBlog(bid)
        if (response.success) {
          fectchBlogs()
          toast.success(response.message)
        }
        else {
          toast.error(response.message)
        }
      }
    })
  }

  return (
    <div className='w-full relative'>
      {editBlog && <div className='absolute inset-0 bg-sky-100 min-h-screen'>
        <UpdateBlog
          editBlog={editBlog}
          setEditBlog={setEditBlog}
          fectchBlogs={fectchBlogs}
        />
      </div>}
      <div className='flex justify-center items-center '>
        <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
          <span>Manage Blog</span>
        </h1>

        <form className='w-[45%] px-4  justify-center items-center ' onSubmit={handleSubmit(handleSearchBlogs)}>
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullwidth
            placeholder='search by title, desscription'
          />
        </form>

      </div>

      <div className='w-full mt-[55px] p-4'>

        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Image Blog</th>
              <th className="px-4 py-2 border border-black">Title Blog</th>
              <th className="px-4 py-2 border border-black">Description</th>
              <th className="px-4 py-2 border border-black">Category</th>
              <th className="px-4 py-2 border border-black">Like</th>
              <th className="px-4 py-2 border border-black">Dislike</th>
              <th className="px-4 py-2 border border-black">Views</th>

              <th className="px-4 py-2 border border-black">CreatedAt</th>
              <th className="px-4 py-2 border border-black">Actions</th>


            </tr>
          </thead>
          <tbody>
            {blogs?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="p-2 border border-black text-center">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                <td className="p-2 border border-black text-center ">
                  <div className='flex justify-center'>
                    <img src={el?.image_blog} alt='thumb' className=' w-12 h-12 object-cover ' />
                  </div>
                </td>
                <td className="p-2 border border-black text-center">{el?.title_blog}</td>
                <td className="p-2 border border-black text-center">
                  {el?.description_blog?.length > 1 && <div
                    className="text-sm cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateString(el?.description_blog, 250)) }}
                    title={el?.description_blog}
                    ></div>}
                </td>
                <td className="p-2 border border-black text-center">{el?.category}</td>

                <td className="p-2 border border-black text-center">{el?.likes?.length}</td>
                <td className="p-2 border border-black text-center">{el?.dislikes?.length}</td>
                <td className="p-2 border border-black text-center">{el?.numberViews}</td>
                <td className="p-2 border border-black text-center">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>



                <td className="py-4 flex flex-col items-center gap-2">
                  <span
                    className="px-2 text-sky-600 hover:underline cursor-pointer"
                    onClick={() => setEditBlog(el)}
                    title='edit'
                  ><FaRegEdit size={24} />
                  </span>
                  <span
                    onClick={() => handldeDeleteBlog(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer'
                    title='Delete'
                  ><MdDeleteForever size={24} /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination
            totalCount={counts}
            name="blogs" />
        </div>
      </div>
    </div>
  )
}

export default ManageBlog