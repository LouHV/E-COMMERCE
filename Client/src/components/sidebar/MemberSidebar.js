import React, { Fragment, memo, useState } from 'react'
import { adminSideBar, memberSidebar } from '../../ultils/contants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import avartar from '../../assets/avatar-default.jpg'
import { FaPen } from "react-icons/fa6";
import path from '../../ultils/path'
import withBase from '../../hocs/withBase'


const activeStyle = 'px-4 py-2 flex items-centar gap-2 text-main '
const notActiveStyle = 'px-4 py-2 flex items-centar gap-2 text-balck hover:bg-gray-200 hover:text-main'

const MemberSidebar = ({ navigate }) => {
    const [actived, setActived] = useState([])
    const data = useSelector(state => state.user)
    const handleShowTabs = (tabID) => {
        if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID)) //xoa di
        else setActived(prev => [...prev, tabID]) //them vao
    }
    return (
        <div className=' bg-white h-full min-h-screen py-4 w-[250px]'>
            <div className='w-ful flex items-center py-4'>
                <img onClick={() => { navigate(`/${path.MEMBER}/${path.PERSONAL}`) }}
                    src={data?.current?.avatar || avartar} alt='logo' className='w-[50px] h-[50px] object-contain rounded-full cursor-pointer' />

                <div className='flex flex-col pl-[15px]'>
                    <small className='text-sm '>{`${data?.current?.firstname} ${data?.current?.lastname}`}</small>
                    <div className='text-sm flex items-center text-gray-500 '>
                        <FaPen />
                        <span onClick={() => { navigate(`/${path.MEMBER}/${path.PERSONAL}`) }} className='text-sm pl-1 cursor-pointer'> Edit profile</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                {
                    memberSidebar.map(el => (
                        <Fragment key={el.id}>
                            {el.type === 'SINGLE' && <NavLink
                                to={el.path}
                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle)}>
                                {el.text}
                            </NavLink>}
                            {el.type === 'PARENT' &&
                                <div onClick={() => handleShowTabs(+el.id)} className=' flex flex-col' >
                                    <div className='flex  items-center justify-between gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer'>
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

export default withBase(memo(MemberSidebar))