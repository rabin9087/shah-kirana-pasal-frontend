import { useAppSelector } from "@/hooks"
import { LocationState } from "@/types/index";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router"

const PrivatePage = ({ children }: PropsWithChildren) => {
  const { email_Phone } = useAppSelector(state => state.userInfo)
  const location = useLocation();
  const fromLocation = location.state as LocationState
  return (
    <div>
      {email_Phone === "" ? <>
        <Navigate state={{ from: fromLocation }} to={"/sign-in"} />
      </> : <>
        {children}
      </>}
    </div>

  )
}

export default PrivatePage

export const ReturenHomePage = ({ children }: PropsWithChildren) => {
  const { user } = useAppSelector(state => state.userInfo)
  const location = useLocation();
  const fromLocation = location.state as LocationState
  return (
    <div>
      {user._id ? <>
        <Navigate state={{ from: fromLocation }} to={"/"} />
      </> : <>
        {children}
      </>}
    </div>

  )
}