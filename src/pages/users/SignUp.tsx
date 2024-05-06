import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import SignUpForm from "@/components/Form/SignUpForm";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
const SignUp = () => {
  const [params] = useSearchParams();
  const token = params.get("token") as string;
  console.log(token);

  useEffect(() => {
    sessionStorage.setItem("accessJWT", token);
  }, [token]);
  return (
    <div className="bg-sign-up  min-h-screen w-full bg-cover flex justify-center items-center">
      <div className=" rounded-md  py-10 sm:w-[70%] w-full backdrop-blur-lg flex  flex-col sm:flex-row bg-black/70">
        <div className="flex  p-5 flex-col sm:flex-1">
          <p className="text-4xl font-bold text-white">Sign Up </p> 
          <div className=" mt-5">
            <SignUpForm token={token} />
          </div>
        </div>
        <div className="flex  items-center justify-center sm:flex-1 flex-col gap-5">
          <p className="text-[20px] text-white">
            Already have an account?{" "}
            <a href="/sign-in" className="text-blue-400">
              Log In
            </a>
          </p>
          <p className="text-white font-bold">OR</p>
          <div className=" flex flex-col gap-5">
            <button className="bg-white rounded-full p-3 text-black text-sm font-bold px-5 flex gap-2">
              <FcGoogle size={25} /> Sign up with google
            </button>
            <button className="bg-white rounded-full p-3 text-black text-sm font-bold px-4 flex gap-2">
              <FaFacebook size={25} /> Sign up with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
