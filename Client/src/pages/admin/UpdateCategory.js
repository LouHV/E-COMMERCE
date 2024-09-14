import React, { useCallback, useEffect, useState } from 'react'
import { Button, CheckboxGroup, Loading } from '../../components';
import InputForm from '../../components/input/inputForm';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { apiGetBrand, apiUpdateCategorys } from '../../apis';
import { showModal } from '../../store/app/appSlice';
import { fileTobase64 } from '../../ultils/helper';

const UpdateCategory = ({ editCategory, setEditCategory, fectchCategory }) => {
  const dispatch = useDispatch()


  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

  const [payload, setPayload] = useState({
    description_blog: '',
  });
  const [brands, setBrands] = useState(null);

  const [preview, setPreview] = useState({
    image: null,
  })

  useEffect(() => {
    reset({
      title: editCategory?.title || '',
      brand: editCategory?.brand || '',
    })
    setPayload({ description_blog: typeof editCategory?.description_blog === 'object' ? editCategory?.description_blog?.join(', ') : editCategory?.description_blog })
    setPreview({
      image: editCategory?.image || '',
    })
  }, [editCategory])
  const [invalidFields, setInvalidFields] = useState([]);

  //xử lý 1 ảnh
  const handlePreviewImgCategory = async (file) => {
    const base64Thumb = await fileTobase64(file)
    setPreview(prev => ({ ...prev, image: base64Thumb }))
  }


  useEffect(() => {
    const imageFile = watch('image');
    if (imageFile instanceof FileList && imageFile.length > 0) {
      handlePreviewImgCategory(imageFile[0]);
    }
  }, [watch('image')]);


  //tao sp
  const handleUpdateCategory = async (data) => {
    const finalPayload = { ...data }
    finalPayload.image = data?.image?.length === 0 ? preview.image : data.image[0]
    const formData = new FormData()
    for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
    
    const response = await apiUpdateCategorys(formData, editCategory._id)

    if (response.success) {
      toast.success(response.message)
      fectchCategory()
      reset()
      setPayload({
        image: '',
      })
      setEditCategory(null)
      toast.success(response.message)
    }
  };
  const fectchBrand = async (params) => {
    const response = await apiGetBrand({
      ...params,
      limit: 20,
    });
    if (response?.success) setBrands(response);
  };
  useEffect(() => {
    fectchBrand();
  }, []);
  return (
    <div className='w-full relative'>
      <div className='flex justify-center items-cente'>
        <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
          <span>Update Category</span>
        </h1>
      </div>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleUpdateCategory)}>
          <InputForm
            label='name Category'
            register={register}
            errors={errors}
            id='title'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth
            placeholder='Title of new Category'
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
            /></div>

          <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor='image' className='font-semibold'>Upload image</label>
            <input
              type='file'
              id='image'
              {...register('image')}

            />
            {errors['image'] && <small className='text-xs text-red-500'>{errors['image']?.message}</small>}
          </div>
          {preview?.image &&
            <div className='my-4'>
              <img src={preview?.image} alt='Thumbnail' className='w-[200px] object-contain' />
            </div>
          }


          <div className='mt-4 gap-2 flex'>
            <Button type='submit' style='px-4 py-2 rounded-md text-white my-2 bg-blue-500 text-semibold hover:bg-blue-400'>Update</Button>
            <Button style='px-4 py-2 rounded-md text-white my-2 bg-main text-semibold hover:bg-red-400' handleOnClick={() => setEditCategory(null)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateCategory