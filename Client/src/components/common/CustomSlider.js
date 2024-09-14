import React, { memo } from "react";
import Slider from "react-slick";
import { Product } from '..'

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Thời gian chuyển đổi giữa các slide (tính bằng mili giây)
};
const CustomSlider = ({ products, activedTab, normal }) => {

    return (
        <>
            {products && <Slider className="custom-slider" {...settings}>
                {products?.map((el, index) => (
                    <Product
                        key={index}
                        pid={el._id}
                        productData={el}
                        isNew={activedTab === 1 ? false : true}
                        normal ={normal}
                    />
                ))}
            </Slider>}
        </>
    )
}
export default memo(CustomSlider)