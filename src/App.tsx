import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ErrorPage from "./Error-page";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Loader from "./components/Loader";
import Home from "./pages/Home";

function App() {
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

        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/sign-up"
          element={<SignUp />}
          errorElement={<ErrorPage />}
        />
      </Routes>{" "}
      <Loader />
    </>
  );
}

export default App;
