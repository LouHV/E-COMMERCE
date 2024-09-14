import React, { memo } from "react";

import { NavLink } from "react-router-dom";
import { createSlug } from '../../ultils/helper'
import { useSelector } from 'react-redux'
import { IoIosMenu } from "react-icons/io";

const Sidebar = () => {
    const { categories } = useSelector(state => state.app)
    return (
        <div>
            <div className="flex h-[50px] border bg-main justify-start items-center text-white gap-2 p-4">
                <IoIosMenu size={24} />
                <span>ALL COLLECTIONS</span>
            </div>
            <div className="flex flex-col border">
                {categories?.map(el => (
                    <NavLink
                        key={createSlug(el.title)}
                        to={createSlug(el.title)}
                        className={({ isActive }) => isActive ? 'bg-main text_white px-5 pt-[15px] pb-[14px] text-sm hover:text-main' : 'px-5 pt-[15px] pb-[14px] hover:text-main'}
                    >
                        {el.title}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default memo(Sidebar);
