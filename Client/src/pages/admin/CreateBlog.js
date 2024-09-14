import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Loading, MarkdownEditor, Select } from '../../components';
import { showModal } from '../../store/app/appSlice';
import { fileTobase64, invalidate } from '../../ultils/helper';
import { ImBin } from 'react-icons/im';
import InputForm from '../../components/input/inputForm';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { apiCreateBlog } from '../../apis';

const CreateBlog = () => {

    const dispatch = useDispatch()

    const { blogs } = useSelector(state => state.blogs);
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

    const [payload, setPayload] = useState({
        description_blog: '',
    });

    const [preview, setPreview] = useState({
        image_blog: null,
        
    })

    const [invalidFields, setInvalidFields] = useState([]);

    const changeValue = useCallback((e) => {

        setPayload(e);
    }, [payload]);


    const [hoverElm, setHoverElm] = useState(null)

    //xử lý 1 ảnh
    const handlePreviewThumb = async (file) => {       
        const base64Thumb = await fileTobase64(file)
        setPreview(prev => ({ ...prev, image_blog: base64Thumb }))
    }


    useEffect(() => {
        handlePreviewThumb(watch('image_blog')[0])

    }, [watch('image_blog')])



    //tao blog
    const handleCreateBlog = async (data) => {
        const invalids = invalidate(payload, setInvalidFields)
        if (invalids === 0) {
            
            const finalPayload = { ...data, ...payload }
            console.log('finalPayload :>> ', finalPayload);
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
            if (finalPayload.image_blog) formData.append('image_blog', finalPayload.image_blog[0])
            console.log('formData :>> ', formData);
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiCreateBlog(formData)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))

            if (response.success) {
                toast.success(response.message)
                reset()
                setPayload({
                    image_blog: '',
                })
            } else {
                toast.error(response.message)
            }
        }
    };

    const handleRemoveImage = (name) => {
        const files = [...watch('images')]
        reset({
            images: files?.filter(el => el.name !== name)
        })
        if (preview?.images?.some(el => el.name === name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))

    }

    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Create new product</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreateBlog)}>
                    <InputForm
                        label='Title blog'
                        register={register}
                        errors={errors}
                        id='title_blog'
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
                        fullWidth
                        placeholder='Category of new Blog'
                    />
                    
                    <MarkdownEditor
                        name='description_blog'
                        changeValue={changeValue}
                        label='Description Blog'
                        invalidFields={invalidFields}
                        setInvalidField={setInvalidFields}
                    />

                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor='image_blog' className='font-semibold'>Upload image of blog</label>
                        <input
                            type='file'
                            id='image_blog'
                            {...register('image_blog', { required: 'Need fill' })}

                        />
                        {errors['image_blog'] && <small className='text-xs text-red-500'>{errors['image_blog']?.message}</small>}
                    </div>
                    {preview?.image_blog &&
                        <div className='my-4'>
                            <img src={preview?.image_blog} alt='Thumbnail' className='w-[200px] object-contain' />
                        </div>
                    }
                    <div className='mt-4'>
                        <Button type='submit'>Create new Blog</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateBlog