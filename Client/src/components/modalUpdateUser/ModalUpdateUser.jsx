import './modalUpdateUser.css';
import React, { useState } from 'react';

const ModalUpdateUser = ({ onClose, updateUser, setUpdateUser, handleUpdate }) => {
    const [userData, setUserData] = useState(updateUser);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Thực hiện xử lý cập nhật thông tin người dùng ở đây
        // Ví dụ: Gửi dữ liệu đến API hoặc thực hiện các hành động cập nhật khác
        handleUpdate(userData);
        onClose();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
        setUpdateUser({ ...userData, [name]: value }); // Cập nhật state ở ngoài component
    };
    console.log('userData :>> ', userData);
    return (
        <div className="modal">
            <form className="modal-content" on onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h1>Update User</h1>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="text" id="email" name="email" value={userData.email} onChange={handleInputChange} disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstname">Firstname:</label>
                        <input type="text" id="firstname" name="firstname" value={userData.firstname} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Lastname:</label>
                        <input type="text" id="lastname" name="lastname" value={userData.lastname} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" value={userData.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobile">Phone:</label>
                        <input type="text" id="mobile" name="mobile" value={userData.mobile} onChange={handleInputChange} />
                    </div>
                    <div className="form-group flex gap-2 items-center">
                        <label htmlFor="role">Role:</label>
                        <select className='rounded border border-gray-300' name="role" value={userData.role} onChange={handleInputChange}>
                            <option value="0">Admin</option>
                            <option value="1">User</option>
                        </select>
                    </div>

                    <div className="form-group flex gap-2 items-center">
                        <label htmlFor="isBlocked">Status:</label>
                        <select className='rounded border border-gray-300' name="isBlocked" value={userData.isBlocked} onChange={handleInputChange}>
                            <option value={false}>Active</option>
                            <option value={true}>Blocked</option>
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="submit-btn" onClick={handleUpdate}>Update</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>

            </form>
        </div>
    );
}

export default ModalUpdateUser;
