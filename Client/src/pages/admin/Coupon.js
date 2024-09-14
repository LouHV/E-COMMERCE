import React, { useEffect, useState, useCallback } from "react";
import { apiGetUsers, apiUpdateUsers, apiDeleteUsers, apiGetCoupon, apiUpdateCoupons, apiDeleteCoupon } from '../../apis'
import { InputField, Pagination, Select } from "../../components/index";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import ModalUpdateCoupon from "../../pages/admin/modalUpdateCoupon/ModalUpdateCoupon.jsx";
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { format } from "date-fns";

const Coupon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [coupons, setCoupons] = useState(null);
  const [updateCoupons, setUpdateCoupons] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });

  const [update, setUpdate] = useState(false)


  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])


  const [params] = useSearchParams();

  const fectchCoupon = async (params) => {
    const response = await apiGetCoupon({
      sort: '-createdAt', ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setCoupons(response);
  };
  console.log('coupons :>> ', coupons);
  const queriesDebounce = useDebounce(queries.q, 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fectchCoupon(queries);
  }, [queriesDebounce, params]);

  //dong mo edit
  const handleOpenModal = (coupon) => {
    setIsModalOpen(true);
    setUpdateCoupons(coupon);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateCoupons(null);
  };

  const handleUpdate = async (couponData) => {
    try {
      const response = await apiUpdateCoupons(couponData, couponData._id)

      if (response.success) {
        fectchCoupon()
        toast.success(response.message)
        setIsModalOpen(false);
      }
      else {
        toast.error(response.message)
      }

    }
    catch (err) {
      console.log(err);
    }

  };
  const handldeDeleteCoupon = (cpid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: 'Are you ready remove this coupon?',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await apiDeleteCoupon(cpid)
        if (response.success) {
          render()
          toast.success(response.message)
          fectchCoupon()
        }
        else {
          toast.error(response.message)
        }
      }
    })
  }

  return (
    <div className="w-full max-w-screen">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Manage Coupons</span>
      </h1>

      <div className="w-full p-4">
        <div className="flex items-center justify-end py-4 ">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w-[500px]"}
            placeholder="search name coupon..."
            isHideLabel
          />
        </div>
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Name Coupon</th>
              <th className="px-4 py-2 border border-black">Coupon Code</th>
              <th className="px-4 py-2 border border-black">Discount</th>
              <th className="px-4 py-2 border border-black">Quantity</th>
              <th className="px-4 py-2 border border-black">Start Day</th>
              <th className="px-4 py-2 border border-black">Expiry</th>
              <th className="px-4 py-2 border border-black">Status</th>
              <th className="px-4 py-2 border border-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.Coupons?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="py-4 border border-black">{idx + 1}</td>
                <td className="py-4 border border-black">{el?.name_coupon}</td>
                <td className="py-4 border border-black">{el?.coupon_code}</td>
                <td className="py-4 border border-black">
                  {el?.type_coupon === "Percent" ? `${el?.discount}%` : `${el?.discount} VNĐ`}
                </td>
                <td className="py-4 border border-black">{el?.quantity}</td>
                <td className="py-4 border border-black">{el?.start_date ? format(new Date(el?.start_date), 'dd/MM/yyyy') : 'Invalid date'}</td>
                <td className="py-4 border border-black"> {el?.expiry ? format(new Date(el?.expiry), 'dd/MM/yyyy') : 'Invalid date'}</td>
                <td className="py-4 border border-black"> {
                  new Date(el?.expiry).getTime() >= Date.now() && new Date(el?.start_date).getTime() <= Date.now()
                    ?
                    <div ><span className="bg-green-500 p-2 rounded-xl text-white ">Still expired</span></div>
                    :
                    <div><span className="bg-red-500 p-2 rounded-xl text-white ">Expired</span></div>
                }</td>

                <td className="py-4 border border-black ">
                  <span
                    className="px-3 text-orange-600 hover:underline cursor-pointer border-r border-r-gray-700"
                    onClick={() => handleOpenModal(el)}>
                    Edit
                  </span>
                  <span
                    onClick={() => handldeDeleteCoupon(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer'>
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination
            name='Coupons'
            totalCount={coupons?.counts} />
        </div>
      </div>
      {isModalOpen && (
        <ModalUpdateCoupon
          onClose={handleCloseModal}
          updateCoupons={updateCoupons}
          setUpdateCoupons={setUpdateCoupons}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

export default Coupon