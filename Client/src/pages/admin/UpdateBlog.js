import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fileTobase64, invalidate } from '../../ultils/helper';
import { toast } from 'react-toastify';
import { showModal } from '../../store/app/appSlice';
import { Button, Loading, MarkdownEditor, Select } from '../../components';
import InputForm from '../../components/input/inputForm';
import { ImBin } from 'react-icons/im';
import { apiUpdateBlogs } from '../../apis';

const UpdateBlog = ({ editBlog, setEditBlog,fectchBlogs }) => {
  const dispatch = useDispatch()


  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

  const [payload, setPayload] = useState({
      description_blog: '',
  });

  const [preview, setPreview] = useState({
      image_blog: null,
  })

  useEffect(() => {
      reset({
          title: editBlog?.title_blog || '',
          category: editBlog?.category || '',
      })
      setPayload({ description_blog: typeof editBlog?.description_blog === 'object' ? editBlog?.description_blog?.join(', ') : editBlog?.description_blog })
      setPreview({
          image_blog: editBlog?.image_blog || '',
      })
  }, [editBlog])

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback((e) => {

      setPayload(e);
  }, [payload]);
  //xử lý 1 ảnh
  const handlePreviewImgBlog = async (file) => {
      const base64Thumb = await fileTobase64(file)
      setPreview(prev => ({ ...prev, image_blog: base64Thumb }))
  }

  
  useEffect(() => {
      const image_blogFile = watch('image_blog');
      if (image_blogFile instanceof FileList && image_blogFile.length > 0) {
          handlePreviewImgBlog(image_blogFile[0]);
      }
  }, [watch('image_blog')]);
  

  const handleRemoveImage = (name) => {
      const files = [...watch('images')]
      reset({
          images: files?.filter(el => el.name !== name)
      })
      if (preview?.images?.some(el => el.name === name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))

  }
  //tao sp
  const handleUpdateBlog = async (data) => {
      const invalids = invalidate(payload, setInvalidFields)
      if (invalids === 0) {
          const finalPayload = { ...data, ...payload }
          finalPayload.image_blog = data?.image_blog?.length === 0 ? preview.images : data.image_blog[0]
          const formData = new FormData()
          for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
         console.log('formData :>> ', formData);
          dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
          const response = await apiUpdateBlogs(formData,editBlog._id )
          dispatch(showModal({ isShowModal: false, modalChildren: null }))
        //   console.log('response :>> ', response);

          if (response.success) {
              toast.success(response.message)
              fectchBlogs()
              reset()
              setPayload({
                  image_blog: '',
              })
              setEditBlog(null)
          } else {
              toast.error(response.message)
          }
      }
  };
  return (
    <div className='w-full relative'>
            <div className='flex justify-center items-cente'>
                <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
                    <span>Update Blog</span>
                </h1>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateBlog)}>
                    <InputForm
                        label='Title Blog'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need fill this filed'
                        }}
                        fullWidth
                        placeholder='Title of new Blog'
                    />
                    <InputForm
                            label='Category'
                            register={register}
                            errors={errors}
                            id='category'
                            validate={{
                                required: 'Need fill this filed'
                            }}
                            style='flex-auto'
                            placeholder='Category of new Blog'
                           
                        />
                    
                    <MarkdownEditor
                        name='description_blog'
                        changeValue={changeValue}
                        label='Description'
                        invalidFields={invalidFields}
                        setInvalidField={setInvalidFields}
                        value={payload.description_blog}
                    />


                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor='image_blog' className='font-semibold'>Upload image_blog</label>
                        <input
                            type='file'
                            id='image_blog'
                            {...register('image_blog')}

                        />
                        {errors['image_blog'] && <small className='text-xs text-red-500'>{errors['image_blog']?.message}</small>}
                    </div>
                    {preview?.image_blog &&
                        <div className='my-4'>
                            <img src={preview?.image_blog} alt='Thumbnail' className='w-[200px] object-contain' />
                        </div>
                    }

                    
                    <div className='mt-4 gap-2 flex'>
                        <Button type='submit' style='px-4 py-2 rounded-md text-white my-2 bg-blue-500 text-semibold hover:bg-blue-400'>Update</Button>
                        <Button style='px-4 py-2 rounded-md text-white my-2 bg-main text-semibold hover:bg-red-400' handleOnClick={() => setEditBlog(null)}>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default UpdateBlog