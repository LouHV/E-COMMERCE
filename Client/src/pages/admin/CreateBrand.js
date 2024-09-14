import React, {  useState, useEffect, useRef } from 'react'
import { showModal } from '../../store/app/appSlice';
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux'
import { Button, Loading } from '../../components';
import InputForm from '../../components/input/inputForm';
import { apiCreateBrand } from '../../apis';


const CreateBrand = () => {
    const dispatch = useDispatch()
    const { register, formState: { errors }, reset, handleSubmit } = useForm();
    //tao coupon
    const handleCreateBrand = async (data) => {
      // dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiCreateBrand(data)
      // dispatch(showModal({ isShowModal: false, modalChildren: null }))
  
      if (response.success) {
        toast.success(response?.message)
        reset()
      } else {
        toast.error(response?.message)
      }
  
    };

    return (
      <div className='w-full'>
        <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
          <span>Create new Brand</span>
        </h1>
        <div className='p-4'>
          <form onSubmit={handleSubmit(handleCreateBrand)}>
  
            <InputForm
              label='Name Brand'
              register={register}
              errors={errors}
              id='title'
              validate={{
                required: 'Need fill this filed'
              }}
              fullWidth
              placeholder='Name of new Brand'
            />
            
            <div className='mt-4'>
              <Button type='submit'>Create</Button>
            </div>
          </form>
        </div>
      </div>
    )
}

export default CreateBrand