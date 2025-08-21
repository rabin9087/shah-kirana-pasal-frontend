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
import { setRestUser } from "@/redux/user.slice";
import { CiShop } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { LuActivity } from "react-icons/lu";
import { RxUpdate } from "react-icons/rx";
import { storeName } from "@/axios";

export function Profile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.userInfo);
    const { language } = useAppSelector((state) => state.settings);
    const { _id, profile, fName, lName, role } = user || {};
    const handleOnSignout = async () => {
        await dispatch(logOutUserAction())
        dispatch(resetCart());
        dispatch(setRestUser())
        navigate("/sign-in");
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
                    <Link to="/my-profile" className="flex items-center gap-2"><CgProfile /> {language === "en" ? "My Profile" : "मेरो प्रोफाइल"}</Link>
                </DropdownMenuItem>
                {
                    (role === "ADMIN" || role === "PICKER" || role === "SUPERADMIN") && (<DropdownMenuItem>
                        <Link to="/dashboard" className="flex items-center gap-2"><MdOutlineDashboard /> {language === "en" ? "Dashboard" : "ड्यासबोर्ड"}</Link>
                    </DropdownMenuItem>)
                }

                {(role === "ADMIN" || role === "SUPERADMIN") && (
                    <>

                        <DropdownMenuItem>
                            <Link to="/product/create" className="flex items-center gap-2"><IoCreateOutline /> Create Product</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link to="/scan-product" className="flex items-center gap-2"><RxUpdate /> Update Product</Link>
                        </DropdownMenuItem>

                    </>
                )}
                <DropdownMenuItem>
                    <Link to="/order-placed" className="flex items-center gap-2"><MdOutlineShoppingCart /> {language === "en" ? "Purchased History" : "खरिद गरिएको इतिहास"}</Link>
                </DropdownMenuItem>
                {user?.role !== "" && storeName === "Shah Kirana Pasal" &&
                    <DropdownMenuItem className="flex">
                        <Link to="/shop" className="flex items-center gap-2"><CiShop /><span> {language === "en" ? "Create Shop" : "पसल सिर्जना गर्नुहोस्"} </span> </Link>
                    </DropdownMenuItem>}
                <DropdownMenuItem className="flex">
                    <Link to="/setting" className="flex items-center gap-2"><IoSettingsOutline /><span> {language === "en" ? "Setting" : "सेटिङ"} </span> </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex">
                    <Link to="/jobs" className="flex items-center gap-2"><LuActivity /><span> {language === "en" ? "Jobs" : "कामहरू"} </span> </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {_id ? (
                        <Button
                            onClick={handleOnSignout}
                            className="w-full bg-primary text-white hover:bg-primary transition-colors"
                        >
                            {language === "en" ? "Log Out" : "लग आउट"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleOnLogin}
                            className="w-full bg-primary text-white hover:bg-primary transition-colors"
                        >
                            {language === "en" ? "Log In" : "लग इन"}
                        </Button>
                    )}

                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
