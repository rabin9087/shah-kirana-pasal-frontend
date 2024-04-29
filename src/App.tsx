import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/signin-signup/SignIn";
import SignUp from "./pages/signin-signup/SignUp";


function App(){
  return (
    <>
    <h1>Hello World!</h1> 
    
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      </>
  );
}

export default App;
