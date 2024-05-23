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

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    dispatch(getUserAction(navigate, pathname));
  }, []);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
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
      </Routes>{" "}
      <Loader />
    </>
  );
}

export default App;
