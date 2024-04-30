import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ErrorPage from "./Error-page";
import SignUp from "./pages/SignUp";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";


function App(){
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
          path="/sign-up"
          element={<SignUp />}
          errorElement={<ErrorPage />}
        />

        <Route
          path="/sign-in"
          element={<SignIn />}
          errorElement={<ErrorPage />}
        />
    
      </Routes>{" "}
      <Loader />
    </>
  );
}

export default App;
