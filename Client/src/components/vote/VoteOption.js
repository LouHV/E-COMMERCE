import React, { memo, useRef, useEffect, useState } from 'react'
import logoVote from '../../assets/cps-ant.png'
import { voteOptions } from '../../ultils/contants'
import { BsStarFill, BsStar } from 'react-icons/bs'
import Button from '../buttons/Button'

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
  const modalRef = useRef()

  const [chosenScore, setChosenScore] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    modalRef.current.scrollIntoView({ block: 'center', bihavior: 'smooth' })
  }, [])



  return (
    <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] p-4 gap-2 flex flex-col items-center justify-center rounded-md'>
      <div className='flex font-semibold  w-full text-[18px]'>Vote and comments</div>
      <div className='flex justify-normal items-center w-full border-b'>
        <img src={logoVote} alt='logo' className=' my-8 object-contain' />
        <h2 className='text-center text-medium text-lg'>{`Voting the product ${nameProduct}`}</h2></div>
      <div className='w-ful flex flex-col gap-2 w-full '>
        <p className='font-semibold text-[18px]'>
          General assessment
        </p>
        <div className='flex justify-center gap-4 items-center border-b'>
          {voteOptions.map(el => (
            <div
              className='w-[100px] h-[100px] cursor-pointer flex items-center justify-center flex-col gap-1 '
              key={el.id}
              onClick={() => setChosenScore(el.id)}
            >
              {(Number(chosenScore) && chosenScore >= el.id) ? <BsStarFill color='orange'></BsStarFill> : <BsStarFill color='gray'></BsStarFill>}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='w-full'>
        <p className='font-semibold text-[18px] py-2'>
          According to experience
        </p>
        <textarea className='form-textarea w-full border border-black min-w-10 rounded-lg flex p-2 text-sm'
          placeholder='type something'
          value={comment}
          onChange={e => setComment(e.target.value)}
        > </textarea>
      </div>

      <Button
        handleOnClick={() => handleSubmitVoteOption({ comment, score: chosenScore })}
        fw>Submit</Button>
    </div>
  )
}

export default memo(VoteOption)