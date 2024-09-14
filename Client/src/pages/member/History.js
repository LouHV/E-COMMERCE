import React, { useEffect, useState } from 'react'
import { apiGetOrders, apiGetUserOrders } from '../../apis';
import { useForm } from 'react-hook-form';
import InputForm from '../../components/input/inputForm';
import { Pagination } from '../../components';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { formatMoney, formatPrice } from '../../ultils/helper';
import { STATUS } from '../../ultils/contants';

const History = () => {
  const { register, formState: { errors }, watch } = useForm()
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()
  const searchParams = Object.fromEntries([...params]);

  const q = watch('q')
  const fectchOrders = async (params) => {
    const response = await apiGetUserOrders({ ...searchParams, limit: process.env.REACT_APP_LIMIT })
    // console.log('response :>> ', response);
    if (response.success) {
      setOrders(response.Orders)
      setCounts(response.counts)

    }
  }
  useEffect(() => {
    fectchOrders()
  }, [params])

  return (
    <div className='w-full relative px-4 bg-gray-100 min-h-[500px] p-5 mt-5 rounded-lg'>
      <header className='text-3xl py-4 border-b border-b-gray-300 '>
        History
      </header>

      <div className="w-ful text-rightx">
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-main text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Products</th>
              <th className="px-4 py-2 border border-black">Total</th>
              <th className="px-4 py-2 border border-black">Status</th>
              <th className="px-4 py-2 border border-black">CreatedAt</th>
              <th className="px-4 py-2 border border-black">Actions</th>


            </tr>
          </thead>
          <tbody>
            {orders?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="p-2 border border-black text-center">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                <td className="p-2 border border-black text-center">
                  <span className='flex flex-col text-left'>
                    {el?.products.map(item => <span key={item._id}>
                      {`${item?.title} - ${item.color} - ${item.price} VNĐ`}
                    </span>)}
                  </span>
                </td>
                <td className="p-2 border border-black text-center">{`${formatMoney(formatPrice(el?.total))} VNĐ`}</td>
                <td className="p-2 border border-black text-center"> {STATUS.find(status => status.id == el.status)?.name || 'Unknown'}
                </td>

                <td className="p-2 border border-black text-center">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>



                {/* <td className="py-4">
                  <span
                    className="px-2 text-orange-600 hover:underline cursor-pointer"
                    onClick={() => setEditProduct(el)}
                  >Edit
                  </span>
                  <span
                    onClick={() => handldeDeleteProduct(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer'>Remove</span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalCount={counts} />
      </div>
    </div>
  )
}

export default History