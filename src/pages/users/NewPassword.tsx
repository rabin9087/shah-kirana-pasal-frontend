import NewPasswordForm from "@/components/Form/NewPasswordForm"
import { Button } from "@/components/ui/button"
import { FaApple, FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

const NewPassword = () => {
  return (
    <div className="bg-sign-up h-screen bg-cover flex ">
    <div className="flex-1 bg-white/75 backdrop-blur-sm p-4 sm:rounded-lg flex justify-center items-center text-black flex-col">
      <p className="text-2xl font-bold ">New Password </p>
      <div className=" w-full sm:w-[400px]">
        <NewPasswordForm />
      </div>
      <span className="mt-5 text-end">
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
    <div className="sm:flex-1 flex justify-center"></div>
  </div>
  )
}

export default NewPassword