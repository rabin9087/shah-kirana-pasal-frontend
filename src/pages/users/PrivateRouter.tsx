import Unauthorized from "@/components/Unauthorized";
import { useAppSelector } from "@/hooks";
import { Navigate, useLocation } from "react-router-dom";

 const PrivateRouter = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    // console.log(location)
    // const fromLocation = location?.state?.from?.location?.pathname
    const {  user} = useAppSelector((state) => state.userInfo);
     return user?.role === "USER" || user?.role === "ADMIN" ? (
        children
    ) : (
        <Navigate
            to={"/sign-in"}
            state={{
                from: { location },
            }}    
        />
    );
};

export default PrivateRouter;

export const AdminPrivateRouter = ({ children }: { children: JSX.Element }) => {
    // const location = useLocation();
    // console.log(location)
    // const fromLocation = location?.state?.from?.location?.pathname
    const { user } = useAppSelector((state) => state.userInfo);
    return user?.role === "ADMIN" ? (
        children
    ) : (
            <Unauthorized/>
    );
};

export const PickerPrivateRouter = ({ children }: { children: JSX.Element }) => {
    // const location = useLocation();
    // console.log(location)
    // const fromLocation = location?.state?.from?.location?.pathname
    const { user } = useAppSelector((state) => state.userInfo);
    return user?.role === "ADMIN" || user?.role === "PICKER" ? (
        children
    ) : (
        <Unauthorized />
    );
};
