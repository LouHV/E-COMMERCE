import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputForm from '../../components/input/inputForm'
import { useDispatch, useSelector } from 'react-redux'
import { HideEmail, HidePhoneNumber } from '../../ultils/helper'
import { Button, Loading } from '../../components'
import avartar from '../../assets/avatar-default.jpg'
import { apiUpdateCurrent } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'
import { showModal } from '../../store/app/appSlice'

const Personal = () => {
  const { register, formState: { errors }, handleSubmit, reset } = useForm()
  const { current } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [preview, setPreview] = useState({
    image: null,
  })
  
  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      avatar: current?.avatar,
      address: current?.address
    })


  }, [current])

  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
 if (data.avatar.length > 0) {
    const file = data.avatar[0];
    if (file.size > 1024 * 1024) { // 1MB = 1024 * 1024 bytes
      toast.error("File size must be less than 1MB");
      return;
    }
    formData.append('avatar', file);
 }
 delete data.avatar;

    for (let i of Object.entries(data)) formData.append(i[0], i[1])
    
    const response = await apiUpdateCurrent(formData)
   
    if (response.success) {
      dispatch(getCurrent())
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  return (
    <div className='w-full relative bg-gray-100 h-auto p-5 mt-5 rounded-lg' >
      <header className='text-3xl border-b border-b-gray-300 flex flex-col'>
        My profile
        <span className='text-xl pb-3'>Manage profile information for account security</span>
      </header>
      <form onSubmit={handleSubmit(handleUpdateInfor)} className='flex gap-4'>

        <div className='w-3/5 mx-auto py-8 flex flex-col gap-5'>
          <div className='flex items-center'>
            <span>User name:</span>
            <span className='ml-2'>{`${current?.firstname} ${current?.lastname}`}</span>
          </div>
          <InputForm
            label='First name:'
            register={register}
            errors={errors}
            id='firstname'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth

          />
          <InputForm
            label='Last Name:'
            register={register}
            errors={errors}
            id='lastname'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth

          />
          <div className='flex items-center'>
            <span className='text-gray-500'>Email:</span>
            <span className='ml-2'>{HideEmail(current?.email)}</span>
          </div>

          {/* <div className='flex items-center'>
            <span className='text-gray-500'>Phone:</span>
            <span className='ml-2'>{HidePhoneNumber(current?.mobile)}</span>
            <span className='ml-4 underline text-blue-500 cursor-pointer'>Change</span>
          </div> */}
          <InputForm
            label='Phone:'
            register={register}
            errors={errors}
            id='mobile'
            validate={{
              required: 'Need fill this filed, phone is a number and has 9 numbers.',
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
              }
            }}
            fullWidth

          />
          <InputForm
            label='Address:'
            register={register}
            errors={errors}
            id='address'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth

          />
          <Button type='submit'>Save</Button>
        </div>
        <div className='w-1/3 items-center justify-center flex flex-col '>
          <div className=' border-l border-l-gray-300 mt-[-120px]'>
            
            <label htmlFor='file' className='justify-center flex'>
              <img className='h-[100px] w-[100px] rounded-full object-contain border my-[20px]' src={current?.avatar || avartar} />
            </label>
            <input type='file' id='file'
              {...register("avatar")}
              className='justify-center flex' />
            <small className='text-sm text-gray-500 '>
              <p className='justify-center flex'>Dụng lượng file tối đa 1 MB</p>
              <p className='justify-center flex'>Định dạng:.JPEG, .PNG</p></small>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Personal