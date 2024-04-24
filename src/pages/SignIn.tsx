import LoginForm from "@/components/Form/LoginForm";
import { Button } from "@/components/ui/button";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  return (
    <div className="bg-sign-up h-screen bg-cover flex ">
      <div className="flex-1 bg-white/75 backdrop-blur-sm rounded-[80px] flex justify-center items-center text-black flex-col">
        <p className="text-2xl font-bold ">Log in</p>
        <div className=" w-full sm:w-[400px]">
          <LoginForm />
        </div>
        <span className="mt-5">
          Don’t have an account?
          <a
            href="/sign-up"
            className="font-semibold text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </a>
        </span>
        <div className="flex justify-center w-full items-center gap-10 mt-10">
          <div className=" w-full border border-gray-400 " />
          <span className="text-gray-400">OR</span>
          <div className=" w-full border border-gray-400 "></div>
        </div>

        <div className="flex justify-center gap-5 mt-10">
          <Button variant={"outline"} className="bg-white border-none">
            <FcGoogle size={30} />
          </Button>
          <Button variant={"outline"} className="bg-white border-none">
            <FaFacebook size={30} color="blue" />
          </Button>
          <Button variant={"outline"} className="bg-white border-none">
            <FaApple size={30} />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex justify-center"></div>
    </div>
  );
};

export default SignIn;
