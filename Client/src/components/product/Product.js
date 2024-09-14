import React, { memo, useState } from "react";
import { formatMoney, formatPrice } from '../../ultils/helper'
import trending from '../../assets/trending.png'
import label from '../../assets/new.png'
import { renderStartFromNumber } from '../../ultils/helper'
import { SelectOptions } from '..'
import icons from "../../ultils/icons";
import { Link } from 'react-router-dom'
import path from "../../ultils/path";
import withBase from "../../hocs/withBase";
import { apiUpdateCart, apiUpdateWishlist } from "../../apis";
import { getCurrent } from "../../store/user/asyncActions";
import { toast } from "react-toastify"
import { useSelector } from "react-redux";
import clsx from "clsx";
import Swal from "sweetalert2";

const { FaHeart, IoMenu } = icons

const Product = ({
    productData,
    isNew,
    normal,
    navigate,
    dispatch,
    pid,
    className
}) => {
    const { current } = useSelector(state => state.user)
    const [isShowOption, setIsShowOption] = useState(false)
    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'MENU') {

            //navigate(`/${productData?.category}/${productData?._id}/${productData?.title}`)
            if (!current) return Swal.fire({
                title: 'Almost...',
                text: 'Please login first!',
                icon: 'info',
                cancelButtonText: 'Not now!',
                showCancelButton: true,
                confirmButtonText: 'Go login page'
            }).then((rs) => {
                if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
           
            const response = await apiUpdateCart({ pid: productData._id, color: productData.color })
          
            if (response.success) {
                toast.success(response.message)
                dispatch(getCurrent())
            } else toast.error(response.message)
        }
        if (flag === 'WISHLIST') {
            const response = await apiUpdateWishlist(pid)
            console.log('abc :>> ', response);
            if (response.success) {
                toast.success(response.message)
                dispatch(getCurrent())
            } else {
                toast.error(response.message)
            }
        }
        // if (flag === 'QUICK_VIEW') console.log('QUICK_VIEW :>> ');
    }
    return (
        <div className={clsx("w-full text-base", className)}>
            <div className="w-full border p-[15px] flex flex-col items-center rounded-[8px]"
                onClick={e => navigate(`/${productData?.category}/${productData?._id}/${productData?.title}`)}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className="w-full relative">
                    {isShowOption && <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top">
                        {/* <span
                            onClick={(e) => handleClickOptions(e, 'WISHLIST')}
                        >
                            <SelectOptions
                                icons={<FaHeart
                                    color={current?.wishlist?.some((i) => i._id === pid) ? 'red' : 'gray'}
                                />} />
                        </span> */}
                        {/* <span
                            onClick={(e) => handleClickOptions(e, 'MENU')}>
                            <SelectOptions icons={<IoMenu />} />
                        </span> */}
                        {/* <span
                            onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}>
                            <SelectOptions icons={<FaRegEye />} />
                        </span> */}
                    </div>}

                    <img src={productData?.thumb || 'https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg'}
                        alt=''
                        className="w-[274px] h-[274px] object-cover cursor-pointer" />
                    {/* {!normal && <img
                        src={isNew ? label : trending}
                        alt=""
                        className={`absolute w-[100px] h-[40px] top-[0] right-[0] objcet-cover`} />} */}

                </div>
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
                    <span className="flex h-4">{renderStartFromNumber(productData?.totalRating)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className="line-clamp-1 hover:text-main cursor-pointer">{productData?.title}</span>
                    <span>{`${formatMoney(formatPrice(productData?.price))} VNĐ`}</span>
                </div>
            </div>
        </div >
    )
}

export default withBase(memo(Product))