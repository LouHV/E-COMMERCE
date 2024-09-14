import React from "react";
import { Banner, Sidebar, BestSellers, FeautureProducts } from '../../components'
import { useSelector } from "react-redux";
import { IoIosArrowForward } from "react-icons/io";


const Public = () => {

    const { categories } = useSelector(state => state.app)
    const { isLoggedIn,current } = useSelector(state => state.app)
    

    return (
        <>
            <div className="w-main flex mt-6">
                <div className="flex flex-col gap-5 w-[20%] flex-auto">
                    <Sidebar />
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[80%] flex-auto ">
                    <Banner />
                    <BestSellers />
                </div>
            </div>
            <div className="my-8">
                <FeautureProducts />
            </div>

            <div className="my-8 w-full">
                <h3 className=" text-[20px] uppercase font-semibold py-[15px] border-2 border-t-main pl-5">Hot Collection</h3>
                <div className="flex flex-wrap gap-4 mt-4  justify-center">
                    {categories?.filter(el => el.brand.length > 0)?.map(el => (
                        <div
                            key={el._id}
                            className="w-[396px]"
                        >
                            <div className="border flex p-4 gap-4 min-h-[190px]">
                                <img src={el?.image} alt="" className=" flex-1 object-contain w-[144px] h-[129px] object-cover-fill" />
                                <div className="flex-1 text-gray-700">
                                    <h4 className="font-semibold uppercase">{el.title}</h4>
                                    <ul className="text-sm">

                                        {el?.brand?.map(item => (
                                            <span key={item} className="flex gap-1 items-center text-gray-500  hover:text-main cursor-pointer">
                                                <IoIosArrowForward size={14} />
                                                <li >{item}</li>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="my-8 w-full">
                <h3 className="text-[20px] uppercase font-semibold py-[15px] border-2 border-t-main">Blogs posts</h3>
            </div> */}
        </>

    )
}
export default Public