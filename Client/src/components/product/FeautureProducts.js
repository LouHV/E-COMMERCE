import React, { useState, useEffect, memo } from "react";
import ProductCard from "./ProductCard";
import { apiGetProducts } from "../../apis";
import withBase from "../../hocs/withBase";

const FeautureProducts = ({ navigate }) => {
    const [products, setProducts] = useState(null)
    console.log('products :>> ', products);

    const fetchProducts = async () => {
        const response = await apiGetProducts({ limit: 9, page: Math.round(Math.random() * 10) })
        if (response.success) setProducts(response.products)
    }
    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <div className="w-full">
            <h3 className="text-[20px] uppercase font-semibold py-[15px] border-2 border-t-main  pl-5">Feauture</h3>
            <div className="flex flex-wrap mt-[15px] mx-[10px]"
            >
                {products?.map(el => (
                    <ProductCard
                        key={el._id}
                        image={el.thumb}
                        title={el.title}
                        totalRating={el.totalRating}
                        price={el.price}
                        category={el.category}
                        pid={el._id}
                    />
                ))}
            </div>
        </div>
    )
}
export default withBase(memo(FeautureProducts))