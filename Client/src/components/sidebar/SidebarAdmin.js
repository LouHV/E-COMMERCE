import React, { Fragment, memo, useState } from 'react'
import { adminSideBar } from '../../ultils/contants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'
import logo from '../../assets/logo2.png'


const activeStyle = 'px-4 py-2 flex items-centar gap-2 text-gray-200 bg-gray-400'
const notActiveStyle = 'px-4 py-2 flex items-centar gap-2 text-gray-200 hover:bg-gray-200 hover:text-black'

const SidebarAdmin = () => {
  const [actived, setActived] = useState([])
  const handleShowTabs = (tabID) => {
    if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID)) //xoa di
    else setActived(prev => [...prev, tabID]) //them vao
  }
  return (
    <div className=' bg-sky-800 h-full py-4 '>
      <div className='flex-col justify-center items-center p-4  flex gap-3'>
        <img src={logo} alt='logo' className='h-[45px]'/>
        <small className='text-white text-xl'>Admin Workspace</small>
      </div>
      <div className='flex flex-col'>
        {
          adminSideBar.map(el => (
            <Fragment key={el.id}>
              {el.type === 'SINGLE' && <NavLink
                to={el.path}
                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle, 'items-center')}>
                {el?.icon}
                {el.text}
              </NavLink>}
              {el.type === 'PARENT' &&
                <div onClick={() => handleShowTabs(+el.id)} className=' flex flex-col text-gray-200  ' >

                  <div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-600 cursor-pointer'>
                    {el?.icon}
                    <span>{el.text}</span>
                    {actived.some(id => id === el.id) ? <FaCaretDown /> : <FaCaretUp />}
                  </div>
                  {actived.some(id => +id === +el.id) && <div className='flex flex-col'>
                    {el.submenu.map(item => (
                      <NavLink
                        key={item.text}
                        to={item.path}
                        onClick={e => e.stopPropagation()}
                        className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle, ' pl-10')}>
                        {item.text}
                      </NavLink>
                    ))}
                  </div>}
                </div>

              }
            </Fragment>
          ))
        }
      </div>
    </div>
  )
}

export default memo(SidebarAdmin)