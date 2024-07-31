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
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { getUserAction } from "./action/user.action";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import CreateProduct from "../src/pages/product/Create";
import { getAllProductAction } from "./action/product.action";
import UpdateProduct from "./pages/product/Update";
import Modal from 'react-modal';
// Set the app element
Modal.setAppElement('#root');

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    dispatch(getUserAction(navigate, pathname));
    dispatch(getAllProductAction())

  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout title="">
              <Home />
            </Layout>
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
          path="/product/update"
          element={<UpdateProduct />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/product/:_id"
          element={<UpdateProduct />}
          errorElement={<ErrorPage />}
        />

        {/* This is last line  */}
      </Routes>


      <Loader />
    </>
  );
}

export default App;
