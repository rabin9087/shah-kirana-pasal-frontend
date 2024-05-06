import { useAppSelector } from "@/hooks"
import { LocationState } from "@/types";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router"

const PrivatePage = ({children}: PropsWithChildren) => {
    const {email_Phone} = useAppSelector(state => state.userInfor)
    const location = useLocation();
    const fromLocation = location.state as LocationState
  return (
   <div>
    {email_Phone === "" ? <>
    <Navigate state={{from: fromLocation}} to={"/sign-in"}/>
    </> : <>
    {children}
    </>}
   </div>
    
  )
}

export default PrivatePage