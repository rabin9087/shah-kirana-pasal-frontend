import { useAppSelector } from "@/hooks";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRouter = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    const {  user} = useAppSelector((state) => state.userInfo);
    return user?.role === "ADMIN" ? (
        children
    ) : (
        <Navigate
            to={"/"}
            state={{
                from: { location },
            }}
                
        />
    );
};

export default PrivateRouter;
