import React, { useState, useCallback } from "react";
import { InputField, Button, Loading } from "../../components";
import { Link, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { apiLogin, apiForgotPassword } from "../../apis/user";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { login } from "../../store/user/userSlice";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import { invalidate } from "../../ultils/helper";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    })

    const [invalidFields, setinvalidFields] = useState([])
    const [isForgotPassword, setisForgotPassword] = useState(false)
    const [searchParams] = useSearchParams()

    const [email, setemail] = useState('')
    const handleForgotPassword = async () => {
        // dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiForgotPassword({ email })
        // dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            setisForgotPassword(false)
            setemail('')
            toast.info(response.message, { theme: 'colored' })
        } else {toast.error(response?.data?.message, { theme: 'colored' })}
    }
    //



    const handleSubmit = useCallback(async () => {
        const { email, password } = payload

        const invalids = invalidate(payload, setinvalidFields)

        if (invalids === 0) {
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiLogin(payload)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            setTimeout(() => {
                Swal.fire(response.success ? 'Logged in successfully!' : 'Oops!', response.message, response.success ? 'Success' : 'Error')
                    .then((result) => { // Nhận kết quả từ swal
                        if (result.isConfirmed && response.success) { // Nếu xác nhận và thành công
                            dispatch(login({ isLoggedIn: true, token: response.accessToken, userData: response.userData }))
                            searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`); // Điều hướng sang trang login
                        }
                    })
            }, 500)

        }

    }, [payload])

    return (
        <div className="w-screen h-screen relative">
            {isForgotPassword && <div className="absolute top-0 left-0 bottom-0 right-0 flex-col bg-white flex items-center py-8 z-50">
                <div className="flex flex-col gap-4">
                    <label htmlFor="email">Enter your email:</label>
                    <div className="flex items-center justify-center mt-2 w-full gap-2">
                        <input type="text" id="email"
                            className="2-[800px] pb-2 border-b  placeholder:text-sm p-1 mr-2"
                            placeholder="Exp: email@gmail.com"
                            value={email}
                            onChange={e => setemail(e.target.value)}
                        />

                        <Button handleOnClick={handleForgotPassword}
                            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'>
                            Send
                        </Button>
                        <Button
                            handleOnClick={() => { setisForgotPassword(false) }} >Back
                        </Button>
                    </div>
                </div>
            </div>}
            <img
                src="https://img.pikbest.com/backgrounds/20220119/e-commerce-carnival-shopping-colorful-gradient-e-commerce-event-poster-background_6243918.jpg!bw700"
                alt=""
                className="w-full h-full object-cover-fill"
            />
            <div className="absolute top-0 bottom-0 left-1/2 right-1/2 items-center justify-center flex">
                <div className="p-8 bg-white rounded-md flex flex-col items-center min-w-[500px] absolute ">
                    <h1 className="text-[28px] font-semibold text-main mb-8">Login</h1>

                    <InputField
                        fullWidth
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidField={setinvalidFields} />
                    <InputField
                        fullWidth
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidField={setinvalidFields} />

                    <Button handleOnClick={handleSubmit}
                        fw>
                        Login
                    </Button>

                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        <span className="text-main hover:underline cursor-pointer"
                            onClick={() => { setisForgotPassword(true) }}
                        >Forgot your account?</span>
                        <Link
                            className="text-main hover:underline cursor-pointer"
                            to={`/${path.REGISTER}`}
                        >Create new account</Link>
                    </div>
                    <Link
                        className="text-blue-500 hover:underline cursor-pointer pl-2"
                        to={`/${path.HOME}`}
                    >Go home?</Link>
                </div>
            </div>
        </div>

    )
}
export default Login