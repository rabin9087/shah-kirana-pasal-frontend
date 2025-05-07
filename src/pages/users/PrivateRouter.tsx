import Unauthorized from "@/components/Unauthorized";
import { useAppSelector } from "@/hooks";
import { Navigate, useLocation } from "react-router-dom";

 const PrivateRouter = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    // console.log(location)
    // const fromLocation = location?.state?.from?.location?.pathname
    const {  user} = useAppSelector((state) => state.userInfo);
     return user?.role !== "" ? (
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
    const { user } = useAppSelector((state) => state.userInfo);
    return user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
        children
    ) : (
            <Unauthorized/>
    );
};

export const PickerPrivateRouter = ({ children }: { children: JSX.Element }) => {
    const { user } = useAppSelector((state) => state.userInfo);
    return user?.role === "ADMIN" || user?.role === "PICKER" || user?.role === "SUPERADMIN" ? (
        children
    ) : (
        <Unauthorized />
    );
};

export const StroreRouter = ({ children }: { children: JSX.Element }) => {
    const { user } = useAppSelector((state) => state.userInfo);
    
    return user?.role === "ADMIN" || user?.role === "STOREUSER" || user?.role === "SUPERADMIN" ? (
        children
    ) : (
        <Unauthorized />
    );
};

export const RoleRouter = ({ children }: { children: JSX.Element }) => {

    const { user } = useAppSelector((state) => state.userInfo);

    return user?.role !== ""? (
        children
    ) : (
        <Unauthorized />
    );
};

export const CustomizeRouter = ({ children, path }: { children: JSX.Element, path: string }) => {

    const { user } = useAppSelector((state) => state.userInfo);

    if (!user?.role) {
        return <Navigate to={`${path}`} replace />;
    }

    // otherwise render the wrapped component
    return children;
};
