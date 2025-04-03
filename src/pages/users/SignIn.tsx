import { Button } from "@/components/ui/button";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SignInForm from "@/components/Form/SignInForm";
import { useAppSelector } from "@/hooks";
import { storeName } from "@/axios";

const SignIn = () => {
  const { user } = useAppSelector(s => s.userInfo)
  const navigate = useNavigate()
  // const location = useLocation()
  // const fromLocation = location?.state?.from?.pathname || location.pathname || "/";
  if (user?._id) {
    navigate("/")
    return
  }
  return (
    <Layout title="">
      <div className="flex flex-col items-center justify-center h-screen bg-sign-up bg-cover">

        {/* Login Form Section */}
        <div className="w-full max-w-md bg-white/90 p-6 rounded-lg shadow-lg">
          {/* <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2> */}

          <SignInForm />

          <div className="text-center mt-4">
            <p className="text-sm">
              New to {storeName} Online?{" "}
              <Link to="/sign-up" className="text-blue-500 font-semibold">
                Sign up now
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center mt-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Login Buttons */}
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

export default SignIn;
