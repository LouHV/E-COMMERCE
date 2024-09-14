import React, { useEffect, useState } from "react";
import { Breadcrumbs, InputField, Pagination } from "../../components";
import { apiGetCoupon } from "../../apis";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
const Coupons = () => {
    const [coupons, setCoupons] = useState(null);
    const [queries, setQueries] = useState({
        q: "",
    });
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
    return (
        <div className="w-full">
            <div className='h-[50px] flex justify-center items-center bg-gray-100 mb-[20px]'>
                <div className="w-main">
                    {/* <h3 className='font-semibold uppercase'>My  Cart</h3> */}
                    <Breadcrumbs />
                </div>
            </div>
            <div className="w-main p-4 mx-auto">

                <table className="table-auto mb-6 w-full">
                    <thead className="font-bold  text-[13px] border border-black text-center bg-main text-white">
                        <tr>
                            <th className="px-4 py-2 border border-black">Stt</th>
                            <th className="px-4 py-2 border border-black">Name Coupon</th>
                            <th className="px-4 py-2 border border-black">Coupon Code</th>
                            <th className="px-4 py-2 border border-black">Discount</th>
                            <th className="px-4 py-2 border border-black">Quantity</th>
                            <th className="px-4 py-2 border border-black">Start Day</th>
                            <th className="px-4 py-2 border border-black">Expiry</th>
                            <th className="px-4 py-2 border border-black">Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {coupons?.Coupons?.map((el, idx) => (
                            <tr key={el._id} className="text-center border border-black">
                                <td className="py-4 border border-black">{idx + 1}</td>
                                <td className="py-4 border border-black">{el?.name_coupon}</td>
                                <td className="py-4 border border-black">{el?.coupon_code}</td>
                                <td className="py-4 border border-black">{el?.discount}</td>
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


                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="w-ful text-rightx">
                    <Pagination
                        name='Coupons'
                        totalCount={coupons?.counts} />
                </div>
            </div></div>
    )
}
export default Coupons