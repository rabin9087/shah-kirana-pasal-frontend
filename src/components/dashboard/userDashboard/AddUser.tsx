import SignUpForm from "@/components/Form/SignUpForm";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";


const AddUser = () => {
    const [params] = useSearchParams();
    const token = params.get("token") as string;

    // Store token in session storage
    useEffect(() => {
        if (token) {
            sessionStorage.setItem("accessJWT", token);
        }
    }, [token]);
  return (
      <div className="flex flex-col items-center justify-center h-screen bg-sign-up bg-cover">
          {/* Main container */}
          <div className="w-full max-w-md bg-white/90 p-6 rounded-lg shadow-lg">
              {/* <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2> */}
              <SignUpForm token={token} nevigateTo="store"/>
          </div>
      </div>
  )
}
export default AddUser