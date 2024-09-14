import React, { useEffect, useState } from 'react'
import { CustomizeVarriants, InputForm } from '../../components'
import { useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from '../../apis'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import moment from "moment";
import { useSearchParams, useParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Pagination } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import UpdateProduct from './UpdateProduct'
import { formatMoney, formatPrice, truncateString } from '../../ultils/helper'
import { MdDeleteForever } from 'react-icons/md'
import { FaRegEdit } from 'react-icons/fa'
import DOMPurify from 'dompurify'
const ManageProduct = () => {
  const [editProduct, setEditProduct] = useState(null);


  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const [customizeVarriants, setCustomizeVarriants] = useState(null)

  const handleSearchProducts = (data) => {
    console.log('data :>> ', data);
  }

  const fectchProducts = async (params) => {
    const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT })
    if (response.success) {
      setProducts(response.products)
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

    fectchProducts(searchParams)
  }, [params])



  const handldeDeleteProduct = (pid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: 'Are you ready remove this product?',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await apiDeleteProduct(pid)
        if (response.success) {
          fectchProducts()
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
      {editProduct && <div className='absolute inset-0 bg-sky-100 min-h-screen'>
        <UpdateProduct
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          fectchProducts={fectchProducts} />
      </div>}

      {customizeVarriants && <div className='absolute inset-0 bg-sky-100 min-h-screen'>
        <CustomizeVarriants
          customizeVarriants={customizeVarriants}
          setCustomizeVarriants={setCustomizeVarriants} />
      </div>}

      <div className='flex justify-center items-center '>
        <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
          <span>Manage Product</span>
        </h1>

        <form className='w-[45%] px-4  justify-center items-center ' onSubmit={handleSubmit(handleSearchProducts)}>
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
              <th className="px-4 py-2 border border-black">Thumb</th>
              <th className="px-4 py-2 border border-black">Title</th>
              <th className="px-4 py-2 border border-black">Category</th>
              <th className="px-4 py-2 border border-black">Brand</th>
              <th className="px-4 py-2 border border-black">Description</th>
              <th className="px-4 py-2 border border-black">Price</th>
              <th className="px-4 py-2 border border-black">Quantity</th>
              <th className="px-4 py-2 border border-black">Sold</th>
              <th className="px-4 py-2 border border-black">Color</th>
              <th className="px-4 py-2 border border-black">CreatedAt</th>
              <th className="px-4 py-2 border border-black">Actions</th>


            </tr>
          </thead>
          <tbody>
            {products?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="p-2 border border-black text-center">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                <td className="p-2 border border-black text-center ">
                  <img src={el?.thumb} alt='thumb' className=' w-12 h-12 object-cover'  />
                </td>
                <td className="p-2 border border-black text-center">{el?.title}</td>
                <td className="p-2 border border-black text-center">{el?.category}</td>
                <td className="p-2 border border-black text-center">{el?.brand}</td>
                <td className="p-2 border border-black text-center">
                  {/* {el?.description?.length > 1 && el?.description?.map(el => (<div key={el} className=" leading-6 list-disc">{el}</div>))} */}
                  {el?.description?.length > 1 && 
                  <div key={el} className=" leading-6 list-disc cursor-pointer"
                  title={el?.description}
                  >{truncateString(el?.description[0],10)}</div>}
                  {el?.description?.length === 1 && <div
                            className="text-sm cursor-pointer"
                            title={el?.description[0]}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateString(el?.description[0],10)) }}></div>}
                  </td>
                <td className="p-2 border border-black text-center ">{`${formatMoney(formatPrice(el?.price))} VNĐ`}</td>
                <td className="p-2 border border-black text-center">{el?.quantity}</td>
                <td className="p-2 border border-black text-center">{el?.sold||0}</td>
                <td className="p-2 border border-black text-center">{el?.color}</td>
                <td className="p-2 border border-black text-center">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>



                <td className="py-4 flex flex-col items-center gap-2">
                  <span
                    className="px-2 text-sky-600 hover:underline cursor-pointer"
                    onClick={() => setEditProduct(el)}
                    title='edit'
                  ><FaRegEdit size={24} />
                  </span>
                  
                  <span
                    onClick={() => handldeDeleteProduct(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer'
                    title='Delete'
                    ><MdDeleteForever size={24} /></span>
                     <span
                    className="px-2 text-orange-600 hover:underline cursor-pointer"
                    onClick={() => setCustomizeVarriants(el)}
                  >Varriants
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  )
}

export default ManageProduct