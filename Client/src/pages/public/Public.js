import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation, TopHeader, Footer } from '../../components'
const Public = () => {
    return (

        <div className="w-full flex flex-col items-center ">
            <TopHeader />
            <Header />
            <Navigation />
            <div className="w-full flex flex-col items-center ">
                <Outlet />

            </div>
            {/* <div className="fixed bottom-0 right-0  p-2 m-2 bg-red-500">Chat</div> */}
            <Footer />
        </div>


    )
}
export default Public