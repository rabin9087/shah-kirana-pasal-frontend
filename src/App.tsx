import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ErrorPage from "./Error-page";
import SignUp from "./pages/users/SignUp";
import Loader from "./components/Loader";
import Home from "./pages/home/Home";
import SignIn from "./pages/users/SignIn";
import ForgetPassword from "./pages/users/ForgetPassword";
import OPTVerification from "./pages/users/OPTVerification";
import NewPassword from "./pages/users/NewPassword";
import PrivatePage from "./pages/users/PrivatePage";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect } from "react";
import { getUserAction } from "./action/user.action";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import CreateProduct from "../src/pages/product/Create";
import UpdateProduct from "./pages/product/Update";
import Modal from 'react-modal';
import UpdateCategory from "./pages/category/Update";
import AllCategories from "./pages/category/Categories";
import AllProducts from "./pages/product/Products";
import ScanProduct from "./pages/product/ScanProduct";
import ProductLanding from "./pages/product/ProductLanding";
import ProductCardByCategory from "./pages/category/ProductsByCategory";
import AddToCart from "./pages/addToCart/AddToCart";
import { ICategoryTypes } from "./types";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "./axios/category/category";
import { setCategory } from "./redux/category.slice";
import Payment from "./pages/payments/Payment";
import SuccessfullPayment, { OrderPlaced } from "./pages/payments/SuccessfullPayment";
import MyProfile from "./pages/my-profile/MyProfile";
// Set the app element
Modal.setAppElement('#root');

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAppSelector(state => state.userInfo)

  const { data = [] } = useQuery<ICategoryTypes[]>({
    queryKey: ['categories'],
    queryFn: () => getAllCategories()
  });

  useEffect(() => {
    if (data.length) {
      dispatch(setCategory(data))
    }
  }, [dispatch, data.length])

  useEffect(() => {
    if (user._id !== "") {
      dispatch(getUserAction(navigate, pathname));
    }
  }, [dispatch, user._id]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
          errorElement={<ErrorPage />}
        />

        <Route
          path="/sign-in"
          element={<SignIn />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/sign-up"
          element={<SignUp />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgetPassword />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/otp-verify"
          element={
            <PrivatePage>
              <OPTVerification />
            </PrivatePage>
          }
          errorElement={<ErrorPage />}
        />

        <Route
          path="/new-password"
          element={
            <PrivatePage>
              <NewPassword />{" "}
            </PrivatePage>
          }
          errorElement={<ErrorPage />}
        />

        <Route
          path="/about"
          element={<Layout title=""> <About /></Layout>}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/contact"
          element={<Layout title=""> <Contact /></Layout>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/product/create"
          element={<CreateProduct />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/all-products"
          element={<AllProducts />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/scan-product"
          element={<ScanProduct />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/product/update/:qrCodeNumber"
          element={<UpdateProduct />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/all-categories"
          element={<AllCategories />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/category/update/:_id"
          element={<UpdateCategory />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/product/:_id"
          element={<ProductLanding />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/category/:slug"
          element={<ProductCardByCategory />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/cart"
          element={<AddToCart />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/payment"
          element={<Payment />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/payment/success"
          element={<SuccessfullPayment />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/order-placed"
          element={<OrderPlaced />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/my-profile"
          element={<MyProfile />}
          errorElement={<ErrorPage />}
        />

        {/* This is last line  */}
      </Routes>


      <Loader />
    </>
  );
}

export default App;
