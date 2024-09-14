import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { formatMoney, formatPrice } from '../../ultils/helper';
import { STATUS } from '../../ultils/contants';
import moment from 'moment';
import { apiGetOrderDetail } from '../../apis';
import { format } from 'date-fns';

const DetailOrder = () => {
    const { orderId } = useParams()
    const [params] = useSearchParams()
    const [orders, setOrders] = useState(null)

    const fectchOrderDetail = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },

            // body: { status: status }
        };
        const response = await fetch(`http://localhost:8080/api/order/detailOrder/${orderId}`, requestOptions);
        const result = await response.json();
        console.log('result :>> ', result);
        if (result.success) {
            setOrders(result?.order)
        }
    }
    useEffect(() => {
        fectchOrderDetail()
    }, [])
    if (!orders) {
        return <div>Loading...</div>; // Hoặc một UI fallback khác
    }
    return (
        <div className='w-full p-2 '>
            
            <div className='flex gap-auto mb-4'>
                <div className='flex mr-20 gap-2'>
                    <div className='flex flex-col'>
                        <span>Code orders:</span>
                        <span>Order creation date:</span>
                        <span>Status:</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>{orders?._id}</span>
                        <span>{format(new Date(orders?.createdAt), 'dd/MM/yyyy')}</span>
                        <span>{STATUS.find(status => status.id == orders?.status)?.name || 'Unknown'}</span>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className='flex flex-col'>
                        <span>Mobile:</span>
                        <span>Address:</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>{orders?.orderBy?.mobile}</span>
                        <span>{orders?.orderBy?.address[0]}</span>
                    </div>
                </div>
            </div>
            <div>
                <table className="table-auto mb-6 w-main">
                    <thead className="font-bold text-xl border border-black text-center bg-sky-700 text-white">
                        <tr>
                            <th className="px-4 py-2 border border-black">Stt</th>
                            <th className="px-4 py-2 border border-black">Image</th>
                            <th className="px-4 py-2 border border-black">Name</th>
                            <th className="px-4 py-2 border border-black">Color</th>
                            <th className="px-4 py-2 border border-black">Quantity</th>
                            <th className="px-4 py-2 border border-black">
                                Unit price</th>
                            <th className="px-4 py-2 border border-black">Total price</th>



                        </tr>
                    </thead>
                    <tbody>
                        {orders?.products?.map((el, idx) => (
                            <tr key={el._id} className="text-center border border-black">
                                <td className="py-4 border border-black">{idx + 1}</td>
                                <td className="py-4 border border-black text-center">
                                    <div className='flex justify-center'>
                                        <img src={el?.thumb} alt='image' className=' w-12 h-12 object-cover ' />
                                    </div>
                                </td>
                                <td className="py-4 border border-black text-center">{el?.title}</td>
                                <td className="py-4 border border-black text-center">{el?.color}</td>
                                <td className="py-4 border border-black text-center">{el?.quantity}</td>
                                <td className="py-4 border border-black text-center">{`${formatMoney(el?.product?.price)} VNĐ`}</td>
                                <td className="py-4 border border-black text-center">{`${formatMoney(el?.product?.price * el?.quantity)} VNĐ`}</td>
                            </tr>

                        ))}
                        {orders &&
                            <tr>
                                <td className="py-2 border-l border-l-black"></td>
                                <td className="py-2 "></td>
                                <td className="py-2 "></td>
                                <td className="py-2 "></td>
                                <td className="py-2  text-center">Total amount</td>
                                <td className="py-2 "></td>
                                <td className="py-2 border-r border-r-black text-center">{`${formatMoney(orders?.total)} VNĐ`}</td>


                            </tr>}
                        {orders?.coupon_code &&
                            <tr>
                                <td className="py-2 border-l border-l-black"></td>
                                <td className="py-2 "></td>
                                <td className="py-2 "></td>
                                <td className="py-2 "></td>
                                <td className="py-2  text-center">
                                    Total discount</td>
                                <td className="py-2 "></td>
                                <td className="py-2 border-r border-r-black text-center">{`${formatMoney(orders?.total - orders?.discountedTotal)} VNĐ`}</td>


                            </tr>}
                        {orders?.discountedTotal &&
                            <tr>
                                <td className="py-2 border-b border-l border-b-black border-l-black"></td>
                                <td className="py-2 border-b border-b-black"></td>
                                <td className="py-2 border-b border-b-black"></td>
                                <td className="py-2 border-b border-b-black"></td>
                                <td className="py-2 border-b border-b-black text-center">Total payment</td>
                                <td className="py-2 border-b border-b-black"></td>
                                <td className="py-2 border-r border-b border-b-black border-r-black text-center">{`${formatMoney(orders?.discountedTotal)} VNĐ`}</td>


                            </tr>}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DetailOrder