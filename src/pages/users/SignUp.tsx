import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import SignUpForm from "@/components/Form/SignUpForm";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const SignUp = () => {
  const [params] = useSearchParams();
  const token = params.get("token") as string;
  // Store token in session storage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("accessJWT", token);
    }
  }, [token]);

  return (
    <Layout title="">
      <div className="flex flex-col items-center justify-center h-screen bg-sign-up bg-cover">
        {/* Main container */}
        <div className="w-full max-w-md bg-white/90 p-6 rounded-lg shadow-lg mt-4 overflow-y-auto">
          {/* <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2> */}

          {/* Render Forms */}
          <SignUpForm token={token} />

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-500 font-semibold">
                Sign in now
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center mt-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span> 
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Sign-up Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" className="bg-white border border-gray-300 shadow-sm">
              <FcGoogle size={24} />
            </Button>
            <Button variant="outline" className="bg-white border border-gray-300 shadow-sm">
              <FaFacebook size={24} color="#1877F2" />
            </Button>
            <Button variant="outline" className="bg-white border border-gray-300 shadow-sm">
              <FaApple size={24} />
            </Button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
