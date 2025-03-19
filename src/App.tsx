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
import ScanProduct from "./pages/product/ScanProduct";
import ProductLanding from "./pages/product/ProductLanding";
import ProductCardByCategory from "./pages/category/ProductsByCategory";
import AddToCart from "./pages/addToCart/AddToCart";
import Payment from "./pages/payments/Payment";
import SuccessfullPayment from "./pages/payments/SuccessfullPayment";
import MyProfile from "./pages/my-profile/MyProfile";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRouter, { AdminPrivateRouter, PickerPrivateRouter } from "./pages/users/PrivateRouter";
import { OrderPlaced } from "./pages/orders/OrderPlaced";
import ContactUs from "./pages/contact/Contact";
import StartPickingOrder from "./pages/orders/StartPickingOrder";
import UserDetails from "./components/dashboard/userDashboard/UserDetails";
import UserProfileEdit from "./components/dashboard/userDashboard/UserProfile";
import NotFoundPage from "./components/notFound/NotFound";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ShowProductDetails from "./pages/product/components/showProduct/ShowProductDetails";
import UpdateProductForm from "./pages/product/components/showProduct/UpdateProductDetails";
import Settings from "./components/setting/Settings";
import PrintProductsQRCodeNameSku from "./pages/product/components/showProduct/PrintProductsBarcodeNameSku";
import PrintSingleProductBarcodeNameSku from "./pages/product/components/showProduct/PrintSingleProductBarcodeNameSku";

// Set the app elementchec
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

    if (!user._id) {  // Only run autoLogin if the user is not logged in
      autoLogin();
    }
  }, [dispatch, fromLocation, user._id]);

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
          path="/category/update/:_id"
          element={<AdminPrivateRouter><UpdateCategory /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/search/product/sku_value/:sku"
          element={
            <AdminPrivateRouter>
              <ShowProductDetails />
            </AdminPrivateRouter>
          }
          errorElement={<ErrorPage />}
        />

        <Route
          path="/update/product/sku_value/:sku"
          element={
            <AdminPrivateRouter>
              <UpdateProductForm />
            </AdminPrivateRouter>
          }
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
          path="/setting"
          element={<Settings />}
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
          path="/order/orderNumber=/:orderNumber"
          element={
            <PickerPrivateRouter>
              <StartPickingOrder />
            </PickerPrivateRouter>
          }
          errorElement={<ErrorPage />}
        />


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
          element={<PickerPrivateRouter><Dashboard /></PickerPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/dashboard/:menu"
          element={<PickerPrivateRouter><Dashboard /></PickerPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        {/* <Route path="/:menu" element={<DashboardLayout />} /> */}

        <Route
          path="/dashboard/user/:userPhone"
          element={<PickerPrivateRouter><UserDetails /></PickerPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/edit/userProfile/:userPhone"
          element={<AdminPrivateRouter><UserProfileEdit /></AdminPrivateRouter>}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/printProductsQRCodeNameSku"
          element={<PrintProductsQRCodeNameSku />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/*"
          element={<NotFoundPage />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/printSingleProductBarcodeNameSku/:qrCodeNumber" 
          element={<PrintSingleProductBarcodeNameSku />}
          errorElement={<ErrorPage />}
        />
        
      </Routes>
      <Loader />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
    </>
  );
}

export default App;