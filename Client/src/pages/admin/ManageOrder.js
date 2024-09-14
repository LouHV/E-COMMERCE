import React, { useEffect, useState } from 'react'
import { Pagination } from '../../components'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { useForm } from 'react-hook-form';
import { apiGetOrders } from '../../apis';
import moment from 'moment';
import avadf from '../../assets/avatar-default.jpg'
import { formatMoney, formatPrice } from '../../ultils/helper';

import { FaPen } from 'react-icons/fa';
import Tooltip from '../../../src/ultils/tooltip';


const ManageOrder = () => {

  const STATUS = [
    {
      id: 1,
      name: "Chưa thanh toán"
    },
    {
      id: 2,
      name: "Đã thanh toán"
    },
    {
      id: 3,
      name: "Xác nhận đơn"
    },
    {
      id: 4,
      name: "Đang giao"
    },
    {
      id: 5,
      name: "Hoàn thành"
    },
    {
      id: 6,
      name: "Huỷ đơn"
    }
  ]

  const [editProduct, setEditProduct] = useState(null);
  // const [showOptions, setShowOptions] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  console.log('paramss :>> ', params);


  const handleSearchProducts = (data) => {
  }
  const fectchOrders = async (params) => {
    const response = await apiGetOrders({ ...params, limit: process.env.REACT_APP_LIMIT, sort: "-createdAt" })
    if (response.success) {
      // console.log('response :>> ', response);
      setOrders(response.Orders)
      setCounts(response.counts)
    }
  }
  const queryDecounce = useDebounce(watch('q'), 800)

  const updateOrderStatus = async (orderId, status) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status })
      // body: { status: status }
    };
    const response = await fetch(`http://localhost:8080/api/order/status/${orderId}`, requestOptions);
    const result = await response.json();
    // const data = result.data;

    if (result.success) {
      toast.success('Cập nhật trạng thái thành công');

      const searchParams = Object.fromEntries([...params]);
      fectchOrders(searchParams);

    } else {
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [tooltipStates, setTooltipStates] = useState({});



  const handleEditClick = (e, orderId) => {
    setTooltipStates(prev => ({
      ...prev,
      [orderId]: {
        show: true,
        position: { x: e.clientX, y: e.clientY }
      }
    }));
  };

  const handleOptionSelect = (orderId, status) => {
    updateOrderStatus(orderId, status);

    setTooltipStates(prev => ({
      ...prev,
      [orderId]: {
        show: false,
        position: { x: 0, y: 0 }
      }
    }));
  };

  const handleCloseTooltip = (orderId) => {
    setTooltipStates(prev => ({
      ...prev,
      [orderId]: {
        show: false,
        position: { x: 0, y: 0 }
      }
    }));
  };

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


  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fectchOrders(searchParams);
  }, [params])



  // const handldeDeleteProduct = (pid) => {
  //   Swal.fire({
  //     title: 'Are you sure...',
  //     text: 'Are you ready remove this product?',
  //     showCancelButton: true
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {

  //       const response = await apiDeleteProduct(pid)
  //       if (response.success) {
  //         fectchProducts()
  //         toast.success(response.message)
  //       }
  //       else {
  //         toast.error(response.message)
  //       }
  //     }
  //   })
  // }
  return (
    <div className='w-full relative p-2'>

      <div className='flex justify-center items-center '>
        <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
          <span>Manage Orders</span>
        </h1>
      </div>
      <div className="w-ful text-rightx">
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">CreatedAt</th>
              <th className="px-4 py-2 border border-black">Order By</th>
              <th className="px-4 py-2 border border-black">Products</th>
              <th className="px-4 py-2 border border-black">Coupon Code</th>
              <th className="px-4 py-2 border border-black">Total</th>
              <th className="px-4 py-2 border border-black">DiscountedTotal </th>
              <th className="px-4 py-2 border border-black">Status</th>


            </tr>
          </thead>
          <tbody>
            {orders?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="p-2 border border-black text-center">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>

                <td className="p-2 border border-black text-center">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>
                <td className="p-2 border border-black text-center">
                  <div className='flex items-center gap-2'><img src={el?.orderBy?.avatar || avadf} className='h-[30px] w-[30px] rounded-full object-contain' />
                    {`${el?.orderBy?.firstname} ${el?.orderBy?.lastname}`}</div></td><td className="p-2 border border-black text-center">
                  <span className='flex flex-col text-left'>
                    {el?.products.map(item => <span key={item._id}>
                      {`${item?.title} - ${item.color} - sl: ${item.quantity} - ${item.price} VNĐ`}
                    </span>)}
                  </span>
                </td>
                <td className="p-2 border border-black text-center">{el?.coupon_code}</td>
                <td className="p-2 border border-black text-center">{`${formatMoney(formatPrice(Math.round(el?.total)))} VNĐ`}</td>
                <td className="p-2 border border-black text-center">{`${formatMoney(formatPrice(Math.round(el?.discountedTotal)))} VNĐ`}</td>
                <td className="p-2 border border-black text-center ">
                  {STATUS.find(status => status.id == el.status)?.name || 'Unknown'}
                  {STATUS.find(status => status.id == el.status)?.name !== 'Huỷ đơn' && (
                    <div className='hover:text-main cursor-pointer'>
                      <FaPen onClick={(e) => handleEditClick(e, el._id)} />
                    </div>
                  )}
                  {/* <Tooltip
                    content={
                      <div className="tooltip">
                        {STATUS.map((option) => (
                          <div
                            key={option.id}
                            onClick={() => handleOptionSelect(el._id, option.id)}
                            className="option-item"
                          >
                            {option.name}
                          </div>
                        ))}
                      </div>
                    }
                    isVisible={tooltipStates[el._id]?.show}
                    onClickOutside={() => handleCloseTooltip()}
                    style={{ left: tooltipStates[el._id]?.position.x, top: tooltipStates[el._id]?.position.y }}
                  /> */}
                  <Tooltip
                    content={
                      <div className="tooltip">
                        {STATUS.map((option) => (
                          <div
                            key={option.id}
                            onClick={() => handleOptionSelect(el._id, option.id)}
                            className="option-item"
                          >
                            {option.name}
                          </div>
                        ))}
                      </div>
                    }
                    isVisible={tooltipStates[el._id]?.show}
                    onMouseLeave={() => handleCloseTooltip(el._id)}
                    style={{ left: tooltipStates[el._id]?.position.x, top: tooltipStates[el._id]?.position.y }}
                  />
                </td>


              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          name="orders"
          totalCount={counts} />
      </div>
    </div>
  )
}

export default ManageOrder