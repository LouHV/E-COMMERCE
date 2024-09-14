import React, { useCallback, useEffect, useState } from 'react'
import { InputField, Pagination } from '../../components';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { apiDeleteBrand, apiGetBrand, apiUpdateBrands } from '../../apis';
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import ModalUpdateBrand from './modalUpdateBrand/ModalUpdateBrand';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';

const ManageBrand = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [brands, setBrands] = useState(null);
    const [updateBrands, setUpdateBrands] = useState(null);
    const [queries, setQueries] = useState({
        q: "",
    });

    const [update, setUpdate] = useState(false)


    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])


    const [params] = useSearchParams();

    const fectchBrand = async (params) => {
        const response = await apiGetBrand({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.success) setBrands(response);
    };
    console.log('brands :>> ', brands);
    const queriesDebounce = useDebounce(queries.q, 800);
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queriesDebounce) queries.q = queriesDebounce;
        fectchBrand(queries);
    }, [queriesDebounce, params]);

    //dong mo edit
    const handleOpenModal = (coupon) => {
        setIsModalOpen(true);
        setUpdateBrands(coupon);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUpdateBrands(null);
    };

    const handleUpdate = async (couponData) => {
        try {
            const response = await apiUpdateBrands(couponData, couponData._id)

            if (response.success) {
                fectchBrand()
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
    const handldeDeleteBrand = (bid) => {
        Swal.fire({
            title: 'Are you sure...',
            text: 'Are you ready remove this coupon?',
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await apiDeleteBrand(bid)
                if (response.success) {
                    fectchBrand()
                    toast.success(response.message)
                }
                else {
                    toast.error(response.message)
                }
            }
        })
    }

    return (
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
                <span>Manage Brands</span>
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
                            <th className="px-4 py-2 border border-black">Name Brand</th>
                            <th className="px-4 py-2 border border-black">Created At</th>
                            <th className="px-4 py-2 border border-black">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands?.Brands?.map((el, idx) => (
                            <tr key={el._id} className="text-center border border-black">
                                <td className="py-4 border border-black">{idx + 1}</td>
                                <td className="py-4 border border-black">{el?.title}</td>
                                <td className="py-4 border border-black">{el?.createdAt ? format(new Date(el?.createdAt), 'dd/MM/yyyy') : 'Invalid date'}</td>
                                <td className="py-4 flex flex-col items-center gap-2">
                                    <span
                                        className="px-2 text-sky-600 hover:underline cursor-pointer"
                                        onClick={() => handleOpenModal(el)} title='edit'
                                        ><FaRegEdit size={24} />
                                    </span>
                                    <span
                                        onClick={() => handldeDeleteBrand(el._id)}
                                        className='px-2 text-orange-600 hover:underline cursor-pointer'title='Delete'
                                        ><MdDeleteForever size={24} />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="w-ful text-rightx">
                    <Pagination
                        name='Brands'
                        totalCount={brands?.counts} />
                </div>
            </div>
            {isModalOpen && (
                <ModalUpdateBrand
                    onClose={handleCloseModal}
                    updateBrands={updateBrands}
                    setUpdateBrands={setUpdateBrands}
                    handleUpdate={handleUpdate}
                />
            )}
        </div>
    )
}

export default ManageBrand