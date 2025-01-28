import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { useAppDispatch, useAppSelector } from "@/hooks";
import { initialState, setUser } from "@/redux/user.slice";
import { logoutUser } from "@/axios/user/user.axios";
import { Link, useNavigate } from "react-router-dom";

export function Profile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.userInfo);

    const handleOnSignout = async () => {
        await logoutUser();
        localStorage.removeItem("refreshJWT");
        sessionStorage.removeItem("accessJWT");
        dispatch(setUser(initialState.user));
        navigate("/sign-in");
    };

    const handleOnLogin = () => {
        navigate("/sign-in");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>C N</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to={"/my-profile"}>My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to={"/dashboard"}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to={"/all-products"}>All Product</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to={"/product/create"}>Create Product</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to={"/scan-product"}>Update Product</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {user?._id === "" ? (
                        <Button
                            onClick={handleOnLogin}
                            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Log In
                        </Button>
                    ) : (
                        <Button
                            onClick={handleOnSignout}
                            className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            Log Out
                        </Button>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
