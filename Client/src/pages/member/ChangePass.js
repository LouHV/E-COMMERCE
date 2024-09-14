import React, { useEffect } from 'react'
import { Button } from '../../components'
import { apiChangePassUser } from '../../apis'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import InputForm from '../../components/input/inputForm'
import { useForm } from 'react-hook-form'

const ChangePass = () => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm()
    const { current } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        reset({
            currentPassword: current?.currentPassword,
            newPassword: current?.newPassword,
        })

    }, [current])

    const handleChangePass = async (data) => {
          const response = await apiChangePassUser(data)
        //   console.log('response :>> ', response);
          if (response.success) {
            toast.success(response.message)
            reset()
          } else {
            toast.error(response.data.message)
          }
    }
    return (
        <div className='w-full relative bg-gray-100 h-auto p-5 mt-5 rounded-lg' >
            <header className='text-3xl border-b border-b-gray-300 flex flex-col'>
                Change Password
            </header>
            <form onSubmit={handleSubmit(handleChangePass)} className='flex gap-4'>

                <div className='w-3/5 mx-auto py-8 flex flex-col gap-5'>
                    <InputForm
                        label='Old password:'
                        register={register}
                        errors={errors}
                        id='currentPassword'
                        validate={{
                            required: 'Need fill this filed'
                        }}
                        fullWidth
                        type='password'
                    />
                    <InputForm
                        label='New Password:'
                        register={register}
                        errors={errors}
                        id='newPassword'
                        validate={{
                            required: 'Need fill this filed'
                        }}
                        fullWidth
                        type='password'

                    />
                    <Button type='submit'>Save</Button>
                </div>

            </form>
        </div>
    )
}

export default ChangePass