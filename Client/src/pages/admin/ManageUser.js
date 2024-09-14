import React, { useEffect, useState, useCallback } from "react";
import { apiGetUsers, apiUpdateUsers, apiDeleteUsers } from '../../apis'

import moment from "moment";
import { roles } from "../../ultils/contants";
import { InputField, Pagination } from "../../components/index";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

import ModalUpdateUser from "../../components/modalUpdateUser/ModalUpdateUser";
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { MdDeleteForever } from 'react-icons/md'
import { FaRegEdit } from 'react-icons/fa'

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState(null);
  const [updateUser, setUpdateUser] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });

  const [update, setUpdate] = useState(false)


  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])





  const [params] = useSearchParams();

  const fectchUser = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setUsers(response);
  };

  const queriesDebounce = useDebounce(queries.q, 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fectchUser(queries);
  }, [queriesDebounce, params]);

  //dong mo edit
  const handleOpenModal = (user) => {
    setIsModalOpen(true);
    setUpdateUser(user);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateUser(null);
  };

  const handleUpdate = async (userData) => {


    try {
      const response = await apiUpdateUsers(userData, userData._id)

      if (response.success) {
        fectchUser()
        toast.success(response.message)
        setIsModalOpen(false);
      }
      else {
        toast.error(response.message)
      }

    }
    catch (err) {
      console.log(err);
    }

  };
  const handldeDeleteUser = (uid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: 'Are you ready remove this user?',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await apiDeleteUsers(uid)
        if (response.success) {
          render()
          fectchUser()
          toast.success(response.message)
        }
        else {
          toast.error(response.message)
        }
      }
    })
  }

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Manage Users</span>
      </h1>

      <div className="w-full p-4">
        <div className="flex items-center justify-end py-4 ">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w-[500px]"}
            placeholder="search name user..."
            isHideLabel
          />
        </div>
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Email Adress</th>
              <th className="px-4 py-2 border border-black">Fisrtname</th>
              <th className="px-4 py-2 border border-black">Lastname</th>
              <th className="px-4 py-2 border border-black">Address</th>
              <th className="px-4 py-2 border border-black">Phone</th>
              <th className="px-4 py-2 border border-black">Role</th>
              <th className="px-4 py-2 border border-black">Status</th>
              <th className="px-4 py-2 border border-black">createdAt</th>
              <th className="px-4 py-2 border border-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.Users?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="py-4 border border-black">{idx + 1}</td>
                <td className="py-4 border border-black">{el?.email}</td>
                <td className="py-4 border border-black">{el?.firstname}</td>
                <td className="py-4 border border-black">{el?.lastname}</td>
                <td className="py-4 border border-black">{el?.address}</td>
                <td className="py-4 border border-black">{el?.mobile}</td>
                <td className="py-4 border border-black">
                  <span>
                    {roles.find((role) => +role.code === +el.role)?.value}
                  </span>
                </td>
                <td className="py-4 border border-black">
                  {el.isBlocked
                    ? <span className="bg-red-500 p-2 rounded-xl text-white">Blocked</span>
                    : <span className="bg-green-500 p-2 rounded-xl text-white ">Active</span>}
                </td>
                <td className="py-4 border border-black">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>

                <td className="py-4 flex flex-col items-center gap-2">
                  <span
                    className="px-2 text-sky-600 hover:underline cursor-pointer"
                    onClick={() => handleOpenModal(el)}
                    title='edit'
                  ><FaRegEdit size={24} />
                  </span>
                  <span onClick={() => handldeDeleteUser(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer'
                    title='Delete'
                  ><MdDeleteForever size={24} /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
      {isModalOpen && (
        <ModalUpdateUser
          onClose={handleCloseModal}
          updateUser={updateUser}
          setUpdateUser={setUpdateUser}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManageUser;
