import React, { memo, useState, useCallback } from 'react'
import { productInforTabs } from '../../ultils/contants'
import { Votebar, Button, VoteOption, Comment } from '..'
import { renderStartFromNumber } from '../../ultils/helper'
import { apiRatings } from '../../apis'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/app/appSlice'
import Swal from 'sweetalert2'
import path from '../../ultils/path'
import { useNavigate } from 'react-router-dom'


const activedStyles = ''
const notActivedStyles = ''

const ProductInformation = ({ totalRating, rating, nameProduct, pid, rerender }) => {
  const [activeTabs, setactiveTabs] = useState(1)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector(state => state.user)
  const handleSubmitVoteOption = async ({ comment, score }) => {

    if (!comment || !pid || !score) {
      alert('Please vote when click submit')
      return
    }
    await apiRatings({ star: score, comment, prdId: pid, updatedAt: Date.now() })
    dispatch(showModal({ isShowModal: false, modal: null }))
    rerender()

  }

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: 'Login to vote',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Go login',
        title: 'Opps!',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/${path.LOGIN}`)
        }
      })
    }
    else {
      dispatch(showModal({
        isShowModal: true,
        modalChildren: <VoteOption nameProduct={nameProduct}
          handleSubmitVoteOption={handleSubmitVoteOption} />
      }))
    }

  }

  return (
    <div >

      <div className='flex items-center gap-2 relative bottom-[-1px]'>
        {/* {productInforTabs.map(el => (
          <span key={el.id}
            className={`p-2 px-4 ${activeTabs === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'} cursor-pointer`}
            onClick={() => setactiveTabs(el.id)}
          >{el.name}</span>

        ))} */}
        <div
          className={`p-2 px-4 ${activeTabs === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'} cursor-pointer`}
          onClick={() => setactiveTabs(5)}
        >
          Customer review

        </div>
      </div>
      <div className='w-full min-h-[300px] border'>
        {/* {productInforTabs.some(el => el.id === activeTabs) && productInforTabs.find(el => el.id === activeTabs)?.content} */}
        {/* {activeTabs === 5 &&
          } */}
<div className='flex p-4 flex-col'>
            <div className='flex p-4'>
              <div className=' flex-4 border flex flex-col items-center justify-center border-red-500'>
                <span className='font-semibold text-3xp'>{`${totalRating}/5`}</span>
                <span className='flex items-center gap-1'>{renderStartFromNumber(totalRating)?.map((el, index) => (
                  <span key={index}>{el}</span>
                ))}</span>
                <span className='text-sm'>
                  {`${rating?.length} reviewers`}
                </span>
              </div>
              <div className='flex-6 border flex flex-col p-4 gap-1'>
                {Array.from(Array(5).keys()).reverse().map(el => (
                  <Votebar
                    key={el}
                    number={el + 1}
                    ratingTotal={rating?.length}
                    ratingCount={rating?.filter(i => i.star === el + 1)?.length}
                  />
                ))}
              </div>
            </div>
            <div className='p-4 flex items-center justify-center text-sm flex-col'>
              <span>Do you review this product?</span>
              <Button handleOnClick={handleVoteNow}>
                Vote now!</Button>

            </div>
            <div className='flex flex-col gap-4'>
              {rating?.map(el => (
                <Comment
                  key={el._id}
                  star={el.star}
                  updatedAt={el.updatedAt}
                  comment={el.comment}
                  name={`${el.postedBy?.firstname} ${el.postedBy?.lastname}`}
                  avatar={el.postedBy?.avatar}
                />
              ))}</div>
          </div>
      </div>
    </div>
  )
}

export default memo(ProductInformation)