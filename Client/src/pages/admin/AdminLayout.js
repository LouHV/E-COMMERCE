import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'
import { SidebarAdmin } from '../../components'

const AdminLayout = () => {
 const { isLoggedIn, current } = useSelector(state => state.user)
 if (!isLoggedIn || !current || +current.role !== 0) return <Navigate to={`/${path.HOME}`} replace={true} />
 return (
    <div className='flex w-full bg-sky-100 min-h-screen relative text-black '>
      <div className='w-3/10 top-0 bottom-0 flex-none overflow-y-auto max-h-screen h-auto'>
        <SidebarAdmin />
      </div>
      <div className='w-7/10 overflow-y-auto w-full max-h-screen '>
        <Outlet />
      </div>
    </div>
 )
}

export default AdminLayout