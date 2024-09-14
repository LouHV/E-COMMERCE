import path from "./path"
import { IoHome } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { GrProductHunt } from "react-icons/gr";
import { GrDocumentText } from "react-icons/gr";
import { FaChartBar } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { BiSolidCoupon } from "react-icons/bi";
import { FaBloggerB } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import { TbBrandProducthunt } from "react-icons/tb";


export const navigation = [
    {
        id: 0,
        value: 'Home',
        path: `/${path.HOME}`,
        icon: <AiOutlineHome size={14} />
    },
    {
        id: 1,
        value: 'Products',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 2,
        value: 'Blogs',
        path: `/${path.BLOGS}`
    },
    {
        id: 3,
        value: 'Coupon',
        path: `/${path.COUPONS}`
    },

]

export const productInforTabs = [
    {
        id: 1,
        name: 'DISCRIPTION',
        content: 'sdfsd'
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: 'sdfs'
    },
    {
        id: 3,
        name: 'DELIVERY',
        content: 'asdasd'
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: 'asdqww'
    },

]
export const colors = [
    'black',
    'brown',
    'white',
    'gold',
    'mineral black',
    'dazzling white',
    'silver',
    'space gray',
    'black leather'
]
export const sorts = [

    {
        id: 1,
        value: '-sold',
        text: 'Best selling'
    },
    {
        id: 2,
        value: 'title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, new to old'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new'
    },
]
export const voteOptions = [
    {
        id: 1,
        text: 'Terrible'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 3,
        text: 'Neutral'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    },
]
export const adminSideBar = [

    // {
    //     id: 1,
    //     type: 'SINGLE',
    //     text: 'Dashboard',
    //     path: `/${path.ADMIN}/${path.DASHBOARD}`,
    //     icon: <FaChartBar />
    // },
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        icon: <FaChartBar />,
        path: `/${path.ADMIN}/${path.DASHBOARD}`

    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage Users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <FaUsers />
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage Products',
        icon: <GrProductHunt />,
        submenu: [
            {
                text: 'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`
            },
            {
                text: 'Manage Product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`
            },
        ]
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <GrDocumentText />
    },
    {
        id: 5,
        type: 'PARENT',
        text: 'Manage Coupons',
        icon: <BiSolidCoupon />,
        submenu: [
            {
                text: 'Create Coupon',
                path: `/${path.ADMIN}/${path.CREATE_COUPON}`
            },
            {
                text: 'Manage Coupons',
                path: `/${path.ADMIN}/${path.COUPON}`
            },
        ]
    },
    {
        id: 6,
        type: 'PARENT',
        text: 'Manage Blogs',
        icon: <FaBloggerB />,
        submenu: [
            {
                text: 'Create Blog',
                path: `/${path.ADMIN}/${path.CREATE_BLOG}`
            },
            {
                text: 'Manage Blogs',
                path: `/${path.ADMIN}/${path.MANAGE_BLOG}`
            },
        ]
    },
    {
        id: 7,
        type: 'PARENT',
        text: 'Manage Category',
        icon: <BiCategory />,
        submenu: [
            {
                text: 'Create Category',
                path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`
            },
            {
                text: 'Manage Categorys',
                path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`
            },
        ]
    },
    {
        id: 8,
        type: 'PARENT',
        text: 'Manage Brand',
        icon: <TbBrandProducthunt />,
        submenu: [
            {
                text: 'Create Brand',
                path: `/${path.ADMIN}/${path.CREATE_BRAND}`
            },
            {
                text: 'Manage Brands',
                path: `/${path.ADMIN}/${path.MANAGE_BRAND}`
            },
        ]
    },
    {
        id: 9,
        type: 'SINGLE',
        text: 'Back to Homepage',
        path: `/${path.HOME}`,
        icon: <IoHome />
    },
]
export const roles = [
    {
        code: 0,
        value: 'admin'
    },
    {
        code: 1,
        value: 'user'
    }
]
export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    }
]


export const memberSidebar = [


    {
        id: 1,
        type: 'PARENT',
        text: 'Personal information',
        submenu: [
            {
                text: 'User information',
                path: `/${path.MEMBER}/${path.PERSONAL}`
            },
            {
                text: 'Change Password',
                path: `/${path.MEMBER}/${path.CHANGEPASS}`
            },
        ]
    },

    {
        id: 2,
        type: 'SINGLE',
        text: 'Buy History',
        path: `/${path.MEMBER}/${path.HISTORY}`
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Wishlist',
        path: `/${path.MEMBER}/${path.WISHLIST}`
    },
]
export const STATUS = [
    {
        id: 1,
        name: "Chưa thanh toán"
    },
    {
        id: 2,
        name: "Đã thanh toán"
    },
    {
        id: 3,
        name: "Xác nhận đơn"
    },
    {
        id: 4,
        name: "Đang giao"
    },
    {
        id: 5,
        name: "Hoàn thành"
    },
    {
        id: 6,
        name: "Huỷ đơn"
    }
]
export const TYPECOUPON = [
    {
        enum: "Percent",
        name: "Percent"
    },
    {
        enum: "Amount",
        name: "Amount"
    },

]