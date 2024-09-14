import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import {
  Home,
  Login,
  Public,
  Faq,
  DetailProducts,
  Blogs,
  Coupons,
  Products,
  Register,
  ResetPassword,
  FinalRegister
} from './pages/public'
import path from './ultils/path'
import {
  AdminLayout,
  ManageUser,
  ManageProduct,
  ManageOrder,
  CreateProduct,
  Dashboard,
  Coupon,
  ManageBlog,
  CreateBlog,
  ManageCategory,
  CreateCategory,
  ManageBrand,
  CreateBrand
} from './pages/admin'
import {
  MemberLayout,
  Personal,
  MyCart,
  History,
  WishList,
  ChangePass,
} from './pages/member'
import { getCategories } from './store/app/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from './components';
import DetailCart from './pages/public/DetailCart';
import Checkout from './pages/member/Checkout';
import SearchPrd from './components/common/SearchPrd';
import Notfound from './Notfound';
import CreateCoupon from './pages/admin/CreateCoupon';
import DetailBlogs from './pages/public/DetailBlogs';

import ErrorBoundary from '../src/ultils/errorBoundary';
import DetailOrder from './pages/member/DetailOrder';
import ChatContext from './context/chatContext';

function App() {
  const dispatch = useDispatch()
  const { isShowModal, modalChildren } = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  return (
    <div>
      <div  className="h-screen font-main relative">

      {/* bo min-h-screen cung dc */}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />} >
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.DETAIL_BLOG__BID__TITLE} element={<DetailBlogs />} />
          <Route path={path.FAQS} element={<Faq />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProducts />} />
          <Route path={path.COUPONS} element={<Coupons />} />
          <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
          <Route path={path.SEARCH} element={<SearchPrd />} />
          {/* //mememe */}
          <Route path={path.MEMBER} element={<MemberLayout />}>
            <Route path={path.PERSONAL} element={<Personal />} />
            <Route path={path.CHANGEPASS} element={<ChangePass />} />
            <Route path={path.HISTORY} element={<History />} />
            <Route path={path.WISHLIST} element={<WishList />} />
            <Route path={path.MY_CART} element={<MyCart />} />
          </Route>

          <Route path={path.ALL} element={<Notfound />} />

        </Route>
        {/* admin */}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>}
          />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProduct />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProduct />} />
          <Route path={path.COUPON} element={<Coupon />} />
          <Route path={path.CREATE_COUPON} element={<CreateCoupon />} />
          <Route path={path.MANAGE_BLOG} element={<ManageBlog />} />
          <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
          <Route path={path.MANAGE_CATEGORY} element={<ManageCategory />} />
          <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
          <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
          <Route path={path.CREATE_BRAND} element={<CreateBrand />} />
        </Route>
        <Route>
          <Route path={path.DETAILORDER} element={<DetailOrder />} />

          <Route path={path.CHAT} element={<ChatContext />} />
        </Route>

        {/* member */}
        {/* <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
        </Route> */}
        {/* lien quan login */}
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.REGISTER} element={<Register />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.CHECKOUT} element={<Checkout />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
      </div>
      <div>

      </div>
    </div>
  );
}

export default App;
