import { useMemo } from 'react'
import { generateRange } from '../ultils/helper'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

const usePagination = (totalPrdCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        const pageSize = process.env.REACT_APP_LIMIT || 10
        const paginationCount = Math.ceil(totalPrdCount / pageSize)
        const totalPaginationItem = siblingCount + 5
        

        if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

        const isShowLeft = currentPage - siblingCount > 2

        const isShowRight = currentPage + siblingCount < paginationCount - 1

        if (isShowLeft && !isShowRight) {
            const rightStart = paginationCount - 4
            const rightRange = generateRange(rightStart, paginationCount)
            return [1, <HiOutlineDotsHorizontal size={40} />, ...rightRange]
        }
        if (!isShowLeft && isShowRight) {
            const leftRange = generateRange(1, 5)

            return [...leftRange, <HiOutlineDotsHorizontal size={40} />, paginationCount]
        }
        const siblingLeft = Math.max(currentPage - siblingCount, 1)
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount)

        if (isShowLeft && isShowRight) {
            const middleRange = generateRange(siblingLeft, siblingRight)
            return [1, <HiOutlineDotsHorizontal size={40} />, ...middleRange, <HiOutlineDotsHorizontal size={40} />, paginationCount]
        }

    }, [totalPrdCount, currentPage, siblingCount])
    return paginationArray
}

export default usePagination


// first + last + current + sibling + 2*DOTS
//MIN=6 =>sibling+5
//totalPagination : 66, limitProduct = 10 => = 7 (66/10 = 6.6)
//totalPaginationItem: sibling +5