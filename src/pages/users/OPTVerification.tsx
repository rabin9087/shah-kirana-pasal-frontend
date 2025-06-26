import { forgetPassword } from "@/axios/user/user.axios"
import OPTVerificationForm from "@/components/Form/OPTVerificationForm"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/hooks"
import { FaApple, FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

const OPTVerification = () => {
  const navigate = useNavigate()
  const { email_Phone } = useAppSelector(s => s.userInfo)

  const handleOnResendOTP = async () => {
    if (email_Phone !== "") {
      await forgetPassword({ email_phone: email_Phone })
      return toast.success("Otp has been sent")
    } else {
      navigate("/forgot-password")
      return toast.error("Please enter your email or phone number")
    }
  }

  return (
    <div className="bg-sign-up h-screen bg-cover flex ">
      <div className="flex-1 bg-white/75 backdrop-blur-sm p-4 sm:rounded-lg flex justify-center items-center text-black flex-col">
        <p className="text-2xl font-bold ">OTP Verification</p>
        <div className=" w-full sm:w-[400px]">
          <OPTVerificationForm />
        </div>
        <span className="mt-5 text-end gap-2">

          <Button
            className="font-semibold  hover:underline cursor-pointer text-white"
            onClick={() => handleOnResendOTP()}
            type="button"
          >
            Resend code
          </Button>
          <button
            className="ms-4 hover:underline cursor-pointer black"
            onClick={() => navigate("/sign-in")}
            type="button"
          >
            Login
          </button>
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

export default OPTVerification