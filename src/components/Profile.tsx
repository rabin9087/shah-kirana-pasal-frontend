import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import { logOutUserAction } from "@/action/user.action";
import { resetCart } from "@/redux/addToCart.slice";

export function Profile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.userInfo);
    const { _id, profile, fName, lName, role } = user || {};
    const handleOnSignout = async () => {
        if (await dispatch(logOutUserAction())) {
            dispatch(resetCart());
            navigate("/sign-in");
        }
    };

    const handleOnLogin = () => navigate("/sign-in");
    console.log(role)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={profile || "https://github.com/shadcn.png"} alt={fName ? `${fName} ${lName}` : "Profile"} />
                    <AvatarFallback>C N</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to="/my-profile">My Profile</Link>
                </DropdownMenuItem>
                {
                    (role === "ADMIN" || role === "PICKER") && (<DropdownMenuItem>
                        <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>)
                }

                {role === "ADMIN" && (
                    <>

                        <DropdownMenuItem>
                            <Link to="/product/create">Create Product</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/scan-product">Update Product</Link>
                        </DropdownMenuItem>

                    </>
                )}
                <DropdownMenuItem>
                    <Link to="/order-placed">Purchased History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {_id ? (
                        <Button
                            onClick={handleOnSignout}
                            className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            Log Out
                        </Button>
                    ) : (
                        <Button
                            onClick={handleOnLogin}
                            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Log In
                        </Button>
                    )}

                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
