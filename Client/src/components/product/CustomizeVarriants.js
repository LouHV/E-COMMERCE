import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import InputForm from '../input/inputForm';
import { ImBin } from 'react-icons/im';
import Button from '../buttons/Button';
import { fileTobase64 } from '../../ultils/helper';
import { toast } from 'react-toastify'
import Loading from '../common/Loading';
import withBase from '../../hocs/withBase';
import { showModal } from '../../store/app/appSlice';
import { apiAddVarriant } from '../../apis';

const CustomizeVarriants = ({ customizeVarriants, setCustomizeVarriants, render, dispatch }) => {
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    })
    useEffect(() => {
        reset({
            title: customizeVarriants?.title,
            color: customizeVarriants?.color,
            price: customizeVarriants?.price
        })
    }, [customizeVarriants])
console.log('customizeVarriants._id :>> ', customizeVarriants._id);

    const handleAddVarriants = async (data) => {
        if (data.color === customizeVarriants.color) return
        else {
            console.log('data :>> ', data);
            const formData = new FormData()
            for (let i of Object.entries(data)) formData.append(i[0], i[1])
            if (data.thumb) formData.append('thumb', data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append('images', image)
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiAddVarriant(formData, customizeVarriants._id)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.message)
                reset()
                setPreview({thumb:'',images:[]})
            } else {
                toast.error(response.message)
            }
        }
    }


    //xử lý 1 ảnh
    const handlePreviewThumb = async (file) => {
        const base64Thumb = await fileTobase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    const handlePreviewImages = async (files) => {

        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not supported!')
                return
            }

            const base64 = await fileTobase64(file)
            imagesPreview.push({ name: file.name, path: base64 })

        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))

    }

    useEffect(() => {
        handlePreviewThumb(watch('thumb')?.[0])

    }, [watch('thumb')])

    useEffect(() => {
        const imagesFiles = watch('images');
        if (imagesFiles && Array.isArray(imagesFiles)) {
            handlePreviewImages(imagesFiles);
        }
    }, [watch('images')])

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='flex justify-center items-cente'>
                <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
                    <span>CustomizeVarriants</span>
                    <span
                        className='text-main hover:underline cursor-pointer'
                        onClick={() => setCustomizeVarriants(null)}>
                        Cancel
                    </span>
                </h1>
            </div>
            <form className='p-4' onSubmit={handleSubmit(handleAddVarriants)}>
                <InputForm
                    label='Name product'
                    register={register}
                    errors={errors}
                    id='title'
                    fullWidth
                    readOnly
                    disabled={true}
                />
                <div className='flex items-center w-full gap-4 '>
                    <InputForm
                        label='Price varriant'
                        register={register}
                        errors={errors}
                        id='price'
                        validate={{
                            required: 'Need fill this filed'
                        }}
                        fullWidth
                        placeholder='Price of new varriant'
                        type='number'
                        style={'flex-auto'}
                    />
                    <InputForm
                        label='Color varriant'
                        register={register}
                        errors={errors}
                        id='color'
                        validate={{
                            required: 'Need fill this filed'
                        }}
                        fullWidth
                        placeholder='Color of new varriant'
                        type='Text'
                        style={'flex-auto'}

                    />

                </div>
                <div className='flex flex-col gap-2 mt-4'>
                    <label htmlFor='thumb' className='font-semibold'>Upload thumb</label>
                    <input
                        type='file'
                        id='thumb'
                        {...register('thumb', { required: 'Need fill' })}

                    />
                    {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
                </div>
                {preview?.thumb &&
                    <div className='my-4'>
                        <img src={preview?.thumb} alt='Thumbnail' className='w-[200px] object-contain' />
                    </div>
                }

                <div className='flex flex-col gap-2 mt-4'>
                    <label htmlFor='products' className='font-semibold'>Upload images of product</label>
                    <input
                        type='file'
                        id='products'
                        multiple
                        {...register('images', { required: 'Need fill' })}
                    />
                    {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
                </div>
                {preview?.images.length > 0 &&
                    <div className='my-4 flex w-full gap-2 flex-wrap max-h-[300px]'>
                        {preview.images?.map((el, idx) => (
                            <div
                                key={idx}
                                className='w-fit relative'
                            >
                                <img src={el.path} alt='product' className='w-[200px] object-contain' />

                            </div>
                        ))}
                    </div>
                }
                <div className='mt-4'>
                    <Button type='submit'>Addnew varraints</Button>
                </div>
            </form>
        </div>
    )
}

export default withBase(memo(CustomizeVarriants))