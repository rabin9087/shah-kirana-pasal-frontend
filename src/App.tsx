import { Route, Routes } from "react-router-dom";
import SignIn from "./components/sign-in/sign-up/SignIn";
import SignUp from "./components/sign-in/sign-up/SignUp";
import Layout from "./components/layout/Layout";

function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Layout>
  );
}

export default App;
