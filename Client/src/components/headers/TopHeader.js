import React, { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import avartar from '../../assets/avatar-default.jpg'
import { RiAdminLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import Swal from 'sweetalert2'
import { getCurrent } from '../../store/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosLogOut } from 'react-icons/io'
import { logout, clearMessage } from '../../store/user/userSlice'

const TopHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn, current, message } = useSelector(state => state.user)

  const [isShowOption, setIsShowOption] = useState(false)

  useEffect(() => {
    const handldeClickoutOptions = (e) => {
      const profile = document.getElementById('profile')
      if (!profile?.contains(e.target)) setIsShowOption(false)
    }
    document.addEventListener('click', handldeClickoutOptions)
    return () => {
      document.removeEventListener('click', handldeClickoutOptions)
    }
  }, [])

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent())
    }, 500)
    return () => {
      clearTimeout(setTimeoutId)
    }
  }, [dispatch, isLoggedIn])
  useEffect(() => {
    if (message) Swal.fire('Opp!', message, 'info').then(() => {
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
    })
  }, [])

  return (
    <div className='h-[40px] w-full bg-main flex items-center justify-center'>
      <div className='w-main flex items-center justify-between text-xs text-white'>
        <span >ORDER ONLINE OR CALL US (+84)869-319-205</span>
        {isLoggedIn && current
          ? <div className='text-[13px] flex items-center justify-center gap-2 cursor-pointer'
            onMouseEnter={e => {
              e.stopPropagation()
              setIsShowOption(true)
            }}
            onMouseLeave={e => {
              e.stopPropagation()
              setIsShowOption(false)
            }}
          >
            <img className='h-[25px] w-[25px] rounded-full object-contain border my-[20px] bg-white' src={current?.avatar || avartar} />
            <div
              className='cursor-pointer relative hover:text-gray-300'
              onClick={() => setIsShowOption(prev => !prev)}
              id='profile'
            >{`${current?.firstname} ${current?.lastname} `}

              {isShowOption &&
                <div onClick={e => e.stopPropagation()}
                  className='absolute top-5 left-0 bg-gray-100 min-w-[180px] border py-2 text-black rounded-sm'>

                  <Link className=' hover:bg-gray-200 hover:text-main p-2 flex gap-1 items-center' to={`/${path.MEMBER}/${path.PERSONAL}`}>
                  <FaRegUser size={15}/>
                    Personal</Link>
                  {current.role === '0' &&
                    <Link className="hover:bg-gray-200 hover:text-main p-2 flex gap-1 items-center"
                      to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                      <RiAdminLine size={15}/>
                      Admin workspace
                    </Link>}

                  <div
                    className=' hover:bg-gray-200 hover:text-main p-2 flex items-center '
                    onClick={() => dispatch(logout())}
                  >
                    <IoIosLogOut size={15} />
                    <span className='px-1'>
                      Logout
                    </span>
                  </div>
                </div>}
            </div>
          </div>
          : <Link className='hover:text-gray-800' to={`/${path.LOGIN}`} >Sign in or Create Account</Link>
        }

      </div>
    </div>
  )
}

export default memo(TopHeader)