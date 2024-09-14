import React, { memo, useCallback, useEffect, useState } from 'react'
import InputForm from '../../components/input/inputForm'
import { useForm } from 'react-hook-form'
import { Button, Loading, MarkdownEditor, Select } from '../../components';
import { ImBin } from 'react-icons/im';
import { fileTobase64, invalidate } from '../../ultils/helper';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
import { apiUpdateProducts } from '../../apis';


const UpdateProduct = ({ editProduct, setEditProduct, fectchProducts }) => {

    const dispatch = useDispatch()

    const { categories } = useSelector(state => state.app);
    const [updateProduct, setUpdateProduct] = useState(null);
    const [update, setUpdate] = useState(false)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

    const [payload, setPayload] = useState({
        description: '',
    });

    const [preview, setPreview] = useState({
        thumb: editProduct?.thumb || '',
        images: editProduct?.images || [],
    })
    const render = useCallback(() => {
        setUpdateProduct(!update)
    }, [update])

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            brand: editProduct?.brand?.toLowerCase() || '',
            category: editProduct?.category || '',
            sold: editProduct?.sold || '',
            color: editProduct?.color || '',

        })
        setPayload({ description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', ') : editProduct?.description })
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || [],
        })
    }, [editProduct])

    const [invalidFields, setInvalidFields] = useState([]);


    const [hoverElm, setHoverElm] = useState(null)

    const changeValue = useCallback((e) => {

        setPayload(e);
    }, [payload]);
    //xử lý 1 ảnh
    const handlePreviewThumb = async (file) => {
        const base64Thumb = await fileTobase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    const handlePreviewImages = async (files) => {
        console.log('files :>> ', files);
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not supported!');
                return;
            }

            const base64 = await fileTobase64(file);
            imagesPreview.push(base64);
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }));
    };

    useEffect(() => {
        const thumbFile = watch('thumb');
        if (thumbFile instanceof FileList && thumbFile.length > 0) {
            handlePreviewThumb(thumbFile[0]);
        }
    }, [watch('thumb')]);

    useEffect(() => {
        const imagesFiles = watch('images');
        if (imagesFiles instanceof FileList && imagesFiles?.length > 0) {
            handlePreviewImages(imagesFiles);
        } else if (imagesFiles?.length === 0) {
            // Nếu không có hình ảnh nào được chọn, sử dụng giá trị mặc định từ preview.images
            setPreview(prev => ({ ...prev, images: editProduct?.images || [] }));
        }
    }, [watch('images')]);
    const handleRemoveImage = (name) => {
        const files = [...watch('images')]
        reset({
            images: files?.filter(el => el.name !== name)
        })
        if (preview?.images?.some(el => el.name === name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))

    }
    //tao sp
    const handleUpdateProduct = async (data) => {
        const invalids = invalidate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el.title === data.category)?.title;
            const finalPayload = { ...data, ...payload }
            finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
            finalPayload.images = data?.images?.length === 0 ? preview.images : data.images;
            if (preview.images.length > 0) {
                for (let image of preview.images) {
                    formData.append('images', image);
                }
            }
            console.log('data?.images?.length:>> ', data?.images?.length);
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiUpdateProducts(formData, editProduct._id)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            // console.log('response :>> ', response);

            if (response.success) {
                toast.success(response.message)
                reset()
                setPayload({
                    thumb: '',
                    images: []
                })
                setEditProduct(null)
                fectchProducts()
            } else {
                toast.error(response.message)
            }
        }
    };

    return (
        <div className='w-full relative'>
            <div className='flex justify-center items-cente'>
                <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
                    <span>Update Product</span>
                </h1>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
                    <InputForm
                        label='Name product'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need fill this filed'
                        }}
                        fullWidth
                        placeholder='Name of new product'
                    />
                    <div className='w-full my-6 flex gap-4'>
                        <InputForm
                            label='Price'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{
                                required: 'Need fill this filed'
                            }}
                            style='flex-auto'
                            placeholder='Price of new product'
                            type='number'
                        />
                        <InputForm
                            label='Quantity'
                            register={register}
                            errors={errors}
                            id='quantity'
                            validate={{
                                required: 'Need fill this filed'
                            }}
                            style='flex-auto'
                            placeholder='Quantity of new product'
                            type='number'
                        />
                        <InputForm
                            label='Color'
                            register={register}
                            errors={errors}
                            id='color'
                            validate={{
                                required: 'Need fill this filed'
                            }}
                            style='flex-auto'
                            placeholder='Color of new product'
                            type='text'
                        />

                    </div>
                    <div className='w-full my-6 flex gap-4'>
                        <Select
                            label='Category'
                            options={categories?.map(el => ({ code: el.title, value: el.title }))}
                            register={register}
                            id='category'
                            validate={{ required: 'Need fill this filed' }}
                            style='flex-auto'
                            errors={errors}
                            fullWidth
                        />
                        <Select
                            label='Brand (Optional)'
                            options={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({ code: el.toLowerCase(), value: el }))}
                            register={register}
                            id='brand'
                            style='flex-auto'
                            errors={errors}
                            fullWidth
                        />
                    </div>
                    <MarkdownEditor
                        name='description'
                        changeValue={changeValue}
                        label='Description'
                        invalidFields={invalidFields}
                        setInvalidField={setInvalidFields}
                        value={payload.description}
                    />


                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor='thumb' className='font-semibold'>Upload thumb</label>
                        <input
                            type='file'
                            id='thumb'
                            {...register('thumb')}

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
                            {...register('images')}
                        />
                        {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
                    </div>
                    {preview?.images.length > 0 &&
                        <div className='my-4 flex w-full gap-2 flex-wrap max-h-[300px]'>
                            {preview.images?.map((el, idx) => (
                                <div
                                    onMouseEnter={() => setHoverElm(el.name)}
                                    key={idx}
                                    className='w-fit relative'
                                    onMouseLeave={() => setHoverElm(null)}>
                                    <img src={el} alt='product' className='h-[300px] w-[200px] object-contain' />

                                </div>
                            ))}
                        </div>
                    }

                    <div className='mt-4 gap-2 flex'>
                        <Button type='submit' style='px-4 py-2 rounded-md text-white my-2 bg-blue-500 text-semibold hover:bg-blue-400'>Update</Button>
                        <Button style='px-4 py-2 rounded-md text-white my-2 bg-main text-semibold hover:bg-red-400' handleOnClick={() => setEditProduct(null)}>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(UpdateProduct)