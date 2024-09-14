import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'
import { MemberSidebar } from '../../components'


const MemberLayout = () => {
  const { isLoggedIn, current } = useSelector(state => state.user)
  if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />
  return (
    <div className=' flex container w-main '>
      <MemberSidebar />
      <div className='flex-auto text-black bg-white min-h-screen pb-10 '><Outlet /></div>
    </div>
  )
}

export default MemberLayout