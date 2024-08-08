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
import { useEffect, useState } from "react";
import { getUserAction } from "./action/user.action";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import CreateProduct from "../src/pages/product/Create";
import { getAllProductAction } from "./action/product.action";
import UpdateProduct from "./pages/product/Update";
import Modal from 'react-modal';
import UpdateCategory from "./pages/category/Update";
import AllCategories from "./pages/category/Categories";
import AllProducts from "./pages/product/Products";
import ScanProduct from "./pages/product/ScanProduct";
import { IProductTypes } from "./types";
import ProductLanding from "./pages/product/ProductLanding";
// Set the app element
Modal.setAppElement('#root');

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { products } = useAppSelector(state => state.productInfo)
  const { user } = useAppSelector(state => state.userInfo)

  const [data, setData] = useState<IProductTypes[]>(products)

  useEffect(() => {
    if (user._id !== "") {
      dispatch(getUserAction(navigate, pathname));
    }
    if (products.length) {
      dispatch(getAllProductAction())
      setData(products)
    }
  }, [dispatch, products.length, user._id]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home data={data} setData={setData} />
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
          element={<Layout title="" types=""> <About /></Layout>}
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


        {/* This is last line  */}
      </Routes>


      <Loader />
    </>
  );
}

export default App;
