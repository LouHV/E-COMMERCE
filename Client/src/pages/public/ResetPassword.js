import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
import withBase from '../../hocs/withBase'
import path from '../../ultils/path'

const ResetPassword = ({navigate}) => {
  const [password, setpassword] = useState('')
  const { token } = useParams()
  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token })
    if(response.success){
      setpassword('')
      toast.success(response.message)
      navigate(`/${path.LOGIN}`)
    }
  }
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex-col bg-white flex items-center py-8 z-50">
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your new password:</label>
        <div className="flex items-center justify-center mt-2 w-full gap-2">
          <input type="text" id="password"
            className="2-[800px] pb-2 border-b  placeholder:text-sm p-1 mr-2"
            placeholder="Type here"
            value={password}
            onChange={e => setpassword(e.target.value)}
          />
          <Button       
            handleOnClick={handleResetPassword}
            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'>
              Submit
            </Button>

        </div>
      </div>
    </div>
  )
}

export default withBase(ResetPassword)