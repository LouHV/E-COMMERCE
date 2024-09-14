import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { apiGetProducts } from "../../apis/product";
import { Product, CustomSlider } from '..';
import { getNewproducts } from "../../store/products/asyncActions";
import { useDispatch, useSelector } from "react-redux";

const tabs = [
    { id: 1, name: 'Best Seller' },
    { id: 2, name: 'News Arrivals' }
];

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null);
    const [activedTab, setActivedTab] = useState(1);
    const dispatch = useDispatch();
    const { newProduct } = useSelector(state => state.products);

    const fetchProducts = useCallback(async () => {
        const response = await apiGetProducts({ sort: '-sold' });
        if (response.success) {
            setBestSellers(response.products);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        dispatch(getNewproducts());
    }, [fetchProducts, dispatch]);

    // Gọi getNewproducts khi activedTab giảm 2
    useEffect(() => {
        if (activedTab === 2) {
            dispatch(getNewproducts());
        }
    }, [activedTab, dispatch]);

    const products = useMemo(() => {
        if (activedTab === 1) return bestSellers;
        if (activedTab === 2) return newProduct;
        return null;
    }, [activedTab, bestSellers, newProduct]);

    const renderTabs = useMemo(() => tabs.map(el => (
        <span
            key={el.id}
            className={`font-semibold capitalize px-8 border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
            onClick={() => { setActivedTab(el.id); }}
        >
            {el.name}
        </span>
    )), [activedTab]);

    return (
        <div>
            <div className="flex text-[20px] pb-4 border-b-2 border-main">
                {renderTabs}
            </div>
            <div className="mt-4 mx-[10px]">
                <CustomSlider  products={products} activedTab={activedTab}></CustomSlider>
            </div>
        </div>
    );
};

export default memo(BestSeller);