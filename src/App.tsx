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
import { autoLoginUserAction } from "./action/user.action";
import About from "./pages/about/About";
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
import Payment from "./pages/payments/Payment";
import SuccessfullPayment from "./pages/payments/SuccessfullPayment";
import MyProfile from "./pages/my-profile/MyProfile";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRouter, { AdminPrivateRouter } from "./pages/users/PrivateRouter";
import { OrderPlaced } from "./pages/orders/OrderPlaced";
import ContactUs from "./pages/contact/Contact";
import OrdersPage from "./pages/orders/OrderPage";

// Set the app element
Modal.setAppElement('#root');

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where the user was navigating from
  const fromLocation = location?.state?.from?.pathname || location.pathname || "/";
  // const { pathname } = useLocation();
  const { user } = useAppSelector(state => state.userInfo);

  // Auto-login logic
  useEffect(() => {
    const autoLogin = async () => {
      const refreshJWT = localStorage.getItem("refreshJWT");
      const accessJWT = sessionStorage.getItem("accessJWT");

      if (!user._id && (refreshJWT || accessJWT)) {
        try {
          const autologin = await dispatch(autoLoginUserAction());
          if (autologin) {
            navigate(fromLocation);
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }
    };

    autoLogin();
  }, [dispatch, fromLocation]);

  useEffect(() => {
    if (user?._id) {
      navigate(fromLocation, { replace: true });
    }
  }, [user?._id, fromLocation, navigate]);


  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home />}
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
              <NewPassword />
            </PrivatePage>
          }
          errorElement={<ErrorPage />}
        />

        <Route
          path="/about"
          element={<Layout title=""><About /></Layout>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/contact"
          element={<Layout title=""><ContactUs /></Layout>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/product/create"
          element={<AdminPrivateRouter><CreateProduct /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/all-products"
          element={<AdminPrivateRouter><AllProducts /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/scan-product"
          element={<AdminPrivateRouter><ScanProduct /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/product/update/:qrCodeNumber"
          element={<AdminPrivateRouter><UpdateProduct /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/all-categories"
          element={<AdminPrivateRouter><AllCategories /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/category/update/:_id"
          element={<AdminPrivateRouter><UpdateCategory /></AdminPrivateRouter>}
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
          element={<PrivateRouter><Payment /></PrivateRouter >
}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/payment/success"
          element={<PrivateRouter><SuccessfullPayment /></PrivateRouter >
}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/order-placed"
          element={<PrivateRouter><OrderPlaced /></PrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/all-orders"
          element={<AdminPrivateRouter><OrdersPage /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        {/* <Route
          path="/all-orders/:orderNumber"
          element={<AdminPrivateRouter><OrderDetails/></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        /> */}

        <Route
          path="/my-profile"
          element={<PrivateRouter><MyProfile /></PrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/products/search"
          element={<ProductCardByCategory />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/dashboard"
          element={<AdminPrivateRouter><Dashboard /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />
      </Routes>
      <Loader />
    </>
  );
}

export default App;