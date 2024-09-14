import React, { useState, useCallback } from 'react'
import { InputField, Button } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { apiRegister } from '../../apis/user';
import Swal from 'sweetalert2'
const Register = () => {
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: ''
    })
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }

    const [invalidFields, setinvalidFields] = useState([])

    const handleSubmit = useCallback(async () => {
        // const { email, password, firstname, lastname, mobile } = payload
        const response = await apiRegister(payload)


        Swal.fire(response.success ? 'Congratulation' : 'Oops!', response.data.message, response.success ? 'Success' : 'Error')
            .then((result) => { // Nhận kết quả từ swal
                if (result.isConfirmed && response.success) { // Nếu xác nhận và thành công
                    resetPayload(); // Reset trường nhập liệu
                    navigate(`/${path.LOGIN}`); // Điều hướng sang trang login
                }
            })


    }, [payload, navigate])

    return (
        <div className="w-screen h-screen relative">
            <img
                src="https://img.pikbest.com/backgrounds/20220119/e-commerce-carnival-shopping-colorful-gradient-e-commerce-event-poster-background_6243918.jpg!bw700"
                alt=""
                className="w-full h-full object-cover-fill"
            />
            <div className="absolute top-0 bottom-0 left-1/2 right-1/2 items-center justify-center flex">
                <div className="p-8 bg-white rounded-md flex flex-col items-center min-w-[500px] absolute ">
                    <h1 className="text-[28px] font-semibold text-main mb-8">Register</h1>
                    <div className='flex items-center gap-2'>
                        <InputField
                            fullWidth
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            setInvalidField={setinvalidFields}
                        />

                        <InputField
                            fullWidth
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            setInvalidField={setinvalidFields} />

                    </div>


                    <InputField
                        fullWidth
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        setInvalidField={setinvalidFields} />
                    <InputField
                        fullWidth
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        setInvalidField={setinvalidFields} />
                    <InputField
                        fullWidth
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        setInvalidField={setinvalidFields}
                    />
                    <Button handleOnClick={handleSubmit}
                        fw>Register</Button>

                    <div className="flex items-center my-2 w-full text-sm">
                        <span>You already have an account?</span>
                        <Link
                            className="text-main hover:underline cursor-pointer pl-2"
                            to={`/${path.LOGIN}`}
                        >Login</Link>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Register