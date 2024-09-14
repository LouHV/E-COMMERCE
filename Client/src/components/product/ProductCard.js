import React, { memo } from "react";
import { formatMoney } from "../../ultils/helper";
import { renderStartFromNumber } from "../../ultils/helper";
import withBase from "../../hocs/withBase";

const ProductCard = ({ price, totalRating, title, image ,navigate,category,pid}) => {
    return (
        <div className="w-1/3 flex-auto px-[10px] mb-[20px]"
        onClick={e => navigate(`/${category}/${pid}/${title}`)}>
            <div className="flex w-full border">
                <img src={image} alt="Products" className="w-[120px] object-contain p-4" />
                <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-xs">
                    <span className="line-clamp-1 capitalize text-sm hover:text-main cursor-pointer">{title?.toLowerCase()}</span>
                    {totalRating !== 0 && <span className="flex h-4">{renderStartFromNumber(totalRating,14)?.map((el,index)=>(
                        <span key={index}>{el}</span>
                    ))}</span>}
                    <span>{`${formatMoney(price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(memo(ProductCard));
