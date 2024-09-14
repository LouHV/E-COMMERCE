import React, { useCallback, useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../../apis'
import InputSelect from '../input/InputSelect'
import Masonry from 'react-masonry-css'
import { sorts } from '../../ultils/contants'
import Product from '../product/Product'
import Pagination from '../Pagination/Pagination'
import noResult from '../../assets/noResult.png'
const SearchPrd = () => {
    const navigate = useNavigate()
    const [products, setproducts] = useState(null)
    const [activeClick, setActiveClick] = useState(null)
    const [params] = useSearchParams()
    const [sort, setSort] = useState('')
    const location = useLocation()
    const queries = Object.fromEntries([...params])
    console.log('queries :>> ', queries);
;
    const fetchProductsByCategory = async (queries) => {
        if (category && category !== 'products') queries.category = category
        const response = await apiGetProducts(queries)
        if (response.success) setproducts(response)

    }

    const { category } = useParams()
    useEffect(() => {
        const queries = Object.fromEntries([...params])
        let priceQuery = {}

        if (queries.to && queries.from) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } },
                ]
            }

            delete queries.price
        }
        else {
            if (queries.from) queries.price = { gte: queries.from }
            if (queries.to) queries.price = { gte: queries.to }
        }

        delete queries.to
        delete queries.from

        // var q= {};


        var p = { ...priceQuery, ...queries };
        fetchProductsByCategory(p)


        // fetchProductsByCategory(q)


        window.scrollTo(0, 0)
    }, [params])

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setActiveClick(null)
        else setActiveClick(name)
    }, [activeClick])

    const changeValue = useCallback((value) => {
        setSort(value)
    }, [sort])

    useEffect(() => {
        if (sort)
            navigate({
                pathname: location.pathname,
                search: createSearchParams({
                    sort
                }).toString()
            });
    }, [sort])

    return (
        <div className="w-full bottom-5">
            {products?.products?.length > 0 && <div>
                <div className="h-[81px] flex justify-center items-center bg-gray-100 gap-2">
                    <span>Search results for keywords: '<span className='text-main'>{`${queries.q}`}</span>' </span>

                </div>
                <div className="w-main border p-4 flex justify-between mt-4 m-auto">
                    <div className="w-4/5 flex-auto flex items-center gap-2">
                        
                    </div>
                    <div className="w-1/5 flex flex-col items-center gap-2">
                        <span className="font-semibold text-sm">Sort by</span>
                        <div className="w-full">
                            <InputSelect
                                changeValue={changeValue}
                                value={sort}
                                options={sorts} />
                        </div>
                    </div>
                </div>
                <div className="mt-4 w-main m-auto">
                    <Masonry
                        breakpointCols={4}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column">
                        {products?.products?.map(el => (
                            <Product
                                key={el._id}
                                pid={el.id}
                                productData={el}
                                normal={true}
                            />
                        ))}
                    </Masonry>
                </div>
            </div>}
            {products?.counts === 0 && <div className='flex flex-col items-center justify-center min-h-[500px]'>
                <img src={noResult} alt='noResult' className='h-[134px] w-[134px]' />
                <span className='text-xl'>No result is found</span>
                <span className='text-xl text-gray-500'>Try using more general keywords</span>
            </div>}
            {products?.products?.length > 0 && <div className=" w-main m-auto my-4 flex justify-center">
                <Pagination
                    totalCount={products?.counts}
                />
            </div>}

        </div>
    )
}

export default SearchPrd