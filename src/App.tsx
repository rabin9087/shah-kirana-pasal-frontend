import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignIn from "./pages/signin-signup/SignIn";
import SignUp from "./pages/signin-signup/SignUp";


function App(){
  return (
    
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    
  );
}

export default App;
