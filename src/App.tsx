import { Route, Routes } from "react-router-dom";
import SignIn from "./components/sign-in/sign-up/SignIn";
import SignUp from "./components/sign-in/sign-up/SignUp";
import Layout from "./components/layout/Layout";
import ErrorPage from "./Error-page";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/sign-up"
          element={<SignUp />}
          errorElement={<ErrorPage />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
