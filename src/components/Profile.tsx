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
import { IoSettingsOutline } from "react-icons/io5";
export function Profile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.userInfo);
    const { language } = useAppSelector((state) => state.settings);
    const { _id, profile, fName, lName, role } = user || {};
    const handleOnSignout = async () => {

        if (await dispatch(logOutUserAction())) {
            dispatch(resetCart());
            navigate("/sign-in");
        }
        localStorage.removeItem("refreshJWT")
        sessionStorage.removeItem("accessJWT")
    };

    const handleOnLogin = () => navigate("/sign-in");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={profile || "https://github.com/shadcn.png"} alt={fName ? `${fName} ${lName}` : "Profile"} />
                    <AvatarFallback>C N</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{language === "en" ? "My Account" : "मेरो खाता"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to="/my-profile">{language === "en" ? "My Profile" : "मेरो प्रोफाइल"}</Link>
                </DropdownMenuItem>
                {
                    (role === "ADMIN" || role === "PICKER") && (<DropdownMenuItem>
                        <Link to="/dashboard">{language === "en" ?  "Dashboard" : "ड्यासबोर्ड"}</Link>
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
                    <Link to="/order-placed">{language === "en" ?  "Purchased History": "खरिद गरिएको इतिहास"}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex">
                    <Link to="/setting" className="flex items-center gap-2"><IoSettingsOutline /><span> {language === "en" ? "Setting" : "सेटिङ"} </span> </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {_id ? (
                        <Button
                            onClick={handleOnSignout}
                            className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            {language === "en" ? "Log Out" : "लग आउट"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleOnLogin}
                            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                                {language === "en" ?  "Log In" : "लग इन"}
                        </Button>
                    )}

                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
