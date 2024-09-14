import React, { useEffect, useState } from 'react'
import { Button, CheckboxGroup, Loading, Select } from '../../components';
import InputForm from '../../components/input/inputForm';
import { apiCreateCategory, apiGetBrand } from '../../apis';
import { useForm } from 'react-hook-form';
import { showModal } from '../../store/app/appSlice';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { fileTobase64 } from '../../ultils/helper';

const CreateCategory = () => {


  const dispatch = useDispatch()

  const [brands, setBrands] = useState(null);
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

  const [preview, setPreview] = useState({
    image: null,

  })

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await fileTobase64(file)
    setPreview(prev => ({ ...prev, image: base64Thumb }))
  }


  useEffect(() => {
    handlePreviewThumb(watch('image')?.[0])

  }, [watch('image')])

  //tao coupon
  const handleCreateCategory = async (data) => {
     console.log('data :>> ', data);
    const finalPayload = { ...data }
    const formData = new FormData()
    for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
    if (finalPayload.image) formData.append('image', finalPayload.image[0])
    console.log('formData :>> ', formData);
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiCreateCategory(formData)
    dispatch(showModal({ isShowModal: false, modalChildren: null }))

    if (response?.success) {
      toast.success(response?.message)
      reset()
    } else {
      toast.error(response?.message)
    }

  };
  const fectchBrand = async (params) => {
    const response = await apiGetBrand({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response?.success) setBrands(response);
  };
  useEffect(() => {
    fectchBrand();
  }, []);
  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create new Category</span>
      </h1>
      <div className='p-4 '>
        <form onSubmit={handleSubmit(handleCreateCategory)}>

          <InputForm
            label='Name category'
            register={register}
            errors={errors}
            id='title'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth
            placeholder='Name of new Category'
          />
          <div className='mt-10'>
            <CheckboxGroup
              label='Brand:'
              options={brands?.Brands?.map(el => ({ code: el._id, value: el.title }))}
              register={register}
              id='brand'

              style='flex-auto'
              errors={errors}
              fullWidth
            />
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor='image' className='font-semibold'>Upload image of blog</label>
            <input
              type='file'
              id='image'
              {...register('image', { required: 'Need fill' })}

            />
            {errors['image'] && <small className='text-xs text-red-500'>{errors['image']?.message}</small>}
          </div>
          {preview?.image &&
            <div className='my-4'>
              <img src={preview?.image} alt='Thumbnail' className='w-[200px] object-contain' />
            </div>
          }
          <div className='mt-4'>
            <Button type='submit'>Create</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCategory