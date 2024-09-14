import './modalUpdateBrand.css';
import React, { useState } from 'react';

const ModalUpdateBrand = ({ onClose, updateBrands, setUpdateBrands, handleUpdate }) => {
    const [couponData, setBrandData] = useState(updateBrands);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Thực hiện xử lý cập nhật thông tin người dùng ở đây
        // Ví dụ: Gửi dữ liệu đến API hoặc thực hiện các hành động cập nhật khác
        handleUpdate(couponData);
        onClose();
    };
   
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBrandData({ ...couponData, [name]: value });
        setUpdateBrands({ ...couponData, [name]: value }); // Cập nhật state ở ngoài component
    };

    return (
        <div className="modal">
            <form className="modal-content" on onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h1>Update Brand</h1>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="title">Name Brand:</label>
                        <input type="text" id="title" name="title" value={couponData.title} onChange={handleInputChange} />
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

export default ModalUpdateBrand;
