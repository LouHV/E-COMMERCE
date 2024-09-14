import React, { useCallback, useEffect, useState } from 'react'
import { InputField, Pagination } from '../../components';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { apiDeleteCategory, apiGetCategory, apiUpdateCategorys } from '../../apis';
import useDebounce from '../../hooks/useDebounce';
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import UpdateCategory from './UpdateCategory'

const ManageCategory = () => {

  const [categorys, setCategorys] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });

  const [update, setUpdate] = useState(false)

  const [editCategory, setEditCategory] = useState(null);


  const [params] = useSearchParams();

  const fectchCategory = async (params) => {
    const response = await apiGetCategory({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setCategorys(response);
  };
  const queriesDebounce = useDebounce(queries.q, 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fectchCategory(queries);
  }, [queriesDebounce, params]);

 
  const handldeDeleteCategory = (bid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: 'Are you ready remove this coupon?',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await apiDeleteCategory(bid)
        if (response.success) {
          fectchCategory()
          toast.success(response.message)
        }
        else {
          toast.error(response.message)
        }
      }
    })
  }
  return (
    <div className="w-full relative">
      {editCategory && <div className='absolute inset-0 bg-sky-100 min-h-screen'>
        <UpdateCategory
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          fectchCategory={fectchCategory}
        />
      </div>}
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Manage Categorys</span>
      </h1>

      <div className="w-full p-4">
        <div className="flex items-center justify-end py-2 ">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w-[500px]"}
            placeholder="search ..."
            isHideLabel
          />
        </div>
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Image</th>
              <th className="px-4 py-2 border border-black">Name Category</th>
              <th className="px-4 py-2 border border-black">Brand</th>
              <th className="px-4 py-2 border border-black">Created At</th>
              <th className="px-4 py-2 border border-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categorys?.productCategory?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="py-2 border border-black">{idx + 1}</td>
                <td className="p-2 border border-black text-center ">
                  <div className='flex justify-center'> 
                  <img src={el?.image} alt='image' className=' w-12 h-12 object-cover ' />
                  </div>
                </td>
                <td className="py-2 border border-black">{el?.title}</td>
                <td className="py-2 border border-black">{Array.isArray(el.brand) ? el.brand.join(', ') : el.brand}</td>

                <td className="py-2 border border-black">{el?.createdAt ? format(new Date(el?.createdAt), 'dd/MM/yyyy') : 'Invalid date'}</td>
                <td className="py-2 flex flex-col items-center gap-2">
                  <span
                    className="px-2 text-sky-600 hover:underline cursor-pointer"
                    onClick={() => setEditCategory(el)} title='edit'
                  ><FaRegEdit size={24} />
                  </span>
                  <span
                    onClick={() => handldeDeleteCategory(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer' title='Delete'
                  ><MdDeleteForever size={24} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination
            name='Categorys'
            totalCount={categorys?.counts} />
        </div>
      </div>
     
    </div>
  )
}

export default ManageCategory