import React, { useCallback, useState, useEffect } from 'react'
import SelectQuantity from '../common/SelectQuantity'
import { formatMoney, formatPrice } from '../../ultils/helper'
import { toast } from 'react-toastify';
import { getCurrent } from '../../store/user/asyncActions';
import { updateCartQuantity, deleteCartProduct } from '../../store/cart/asyncActions';
import withBase from '../../hocs/withBase';
import { MdDeleteForever } from 'react-icons/md';

const OrderItems = ({ el, dispatch, navigate }) => {
    console.log(el, "el::XX");
    const [quantity, setQuantity] = useState(el?.quantity || 1);
    const [price, setPrice] = useState(el?.price || 1);
    const [prevQuantity, setPrevQuantity] = useState(quantity);

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return;
        } else {
            setQuantity(number);
        }
    }, []);

    const handleChangeQuantity = useCallback((flag) => {
        let newQuantity = quantity;
        // if (flag === 'minus' && quantity === 1) return;
        if (flag === 'minus') newQuantity -= 1;
        if (flag === 'plus') newQuantity += 1;

        setQuantity(newQuantity);

        if (newQuantity === 0) {
            dispatch(deleteCartProduct({ productId: el.product }));
            toast.success('Product removed from cart');
        }
    }, [quantity, dispatch, el.product]);


    useEffect(() => {
        if (quantity !== prevQuantity) {
            const newPrice = price * quantity / prevQuantity;
            setPrice(newPrice);
            setPrevQuantity(quantity);

            dispatch(updateCartQuantity({ productId: el.product, quantity: quantity, price: newPrice }));
        }
    }, [quantity, prevQuantity, price, dispatch, el.product]);




    const handelClickDelete = async (productId) => {
        dispatch(deleteCartProduct({ productId }));
        toast.success('Success');
    }

    return (
        <div className='w-main mx-auto grid my-8 p-3 border grid-cols-10 '>
            <span className='col-span-5  w-full text-center cursor-pointer'>
                <div className='flex gap-2'
                    onClick={e => navigate(`/${el?.category}/${el?.product}/${el?.title}`)}>
                    <img src={el?.thumb} alt='thumb' className='w-[80px] h-[80px] object-cover' />
                    <div className='flex flex-col gap-1'>
                        <span className='text-sm text-main'>{el?.title}</span>
                        <span className='text-[10px]'>{el.color}</span>
                        {/* <span className='text-sm'>{formatMoney(el.product?.price) + ' VND'}</span> */}
                    </div>
                </div>
            </span>
            <div className="text-sm flex justify-center">
                <div className="flex items-center">
                    <SelectQuantity
                        fullWidth={true}
                        quantity={el?.quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                </div>


            </div>
            <span className='col-span-3 w-full text-center'>
                <span className='flex w-full h-full items-center justify-center text-orange-500'>
                    {`${formatMoney((el?.price))} VND`}
                </span>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div
                    onClick={() => handelClickDelete(el?.product)}
                    className='flex w-full h-full items-center justify-center hover:text-main hover:underline cursor-pointer'>
                    Delete
                </div>
            </span>
        </div>
    )
}

export default withBase(OrderItems)