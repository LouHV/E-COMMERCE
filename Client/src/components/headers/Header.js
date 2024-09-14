import React, { Fragment, memo, useEffect, useState } from "react";
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link, createSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector, useDispatch } from 'react-redux'
import withBase from "../../hocs/withBase";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";

import InputForm from "../input/inputForm";
import { useForm } from "react-hook-form";

import { getCart } from '../../store/cart/asyncActions'

const Header = ({ navigate }) => {
    const { FaCartShopping, FaRegHeart, IoSearch } = icons;
    const [inputSearch, setInputSearch] = useState('');

    const dispatch = useDispatch();
    const { current } = useSelector(state => state.user);
    const { cart } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(getCart());
        console.log("cart::", cart);
    }, [current]);


    // const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
    const handleOnclick = () => {
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
        navigate(`/${path.DETAIL_CART}`)
    }

    const handleWishList = () => {
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
        navigate(`/${path.MEMBER}/${path.WISHLIST}`)
    }

    // const queryDecounce = useDebounce(watch('q'), 800)


    //search
    // useEffect(() => {
    //     if (inputSearch) {

    //         navigate({
    //             pathname: '/search',
    //             search: createSearchParams({ q: inputSearch }).toString()
    //         })
    //     } else {
    //         navigate({
    //             pathname: '/search'
    //         })
    //     }
    // }, [inputSearch])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputSearch) {
            navigate({
                pathname: '/search',
                search: createSearchParams({ q: inputSearch }).toString(),
            })
        } else {
            navigate({
                pathname: '/search'
            })
        }

    }
    return (
        <div className=" w-main flex justify-between h-[110px] py-[35px]">
            <Link className="items-center" to={`/${path.HOME}`}><img src={logo} alt="logo" className="w-[234px] object-contain" /></Link>
            <form onSubmit={handleSubmit}
                className="flex items-center justify-center w-[40%]"

                style={{ border: '2px solid red', borderRadius: '4px 0px 0px 4px' }}>
                <input type="text" placeholder="Search..." className="w-[100%] h-[100%] px-[5px]"
                    value={inputSearch}
                    onChange={(e) => setInputSearch(e.target.value)

                    } />
                <button type="submit" value="Submit" className="flex items-center justify-center" style={{ backgroundColor: 'red', color: 'white', height: '100%', width: '10%' }}><IoSearch size={23} /></button>
            </form>
            <div className="flex px-5">
                <div></div>
                <div className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleWishList()}>
                    <FaRegHeart color="red" size={24} />
                </div>
                <div className="flex items-center justify-center gap-2 px-5 cursor-pointer hover:text-main "
                    onClick={() => {
                        handleOnclick()
                    }}>
                    <FaCartShopping color="red" size={24} />
                    {/* <span>{`${current?.cart?.length || 0} item(s)`}</span> */}
                    <span>{`${cart?.cart_products?.length || 0} item(s)`}</span>
                </div>

            </div>
        </div>

    )
}
export default withBase(memo(Header))