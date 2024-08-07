
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useTheme } from "./ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { getUserAction } from "@/action/user.action";
import { toast } from "sonner";

export function Profile() {
    // const { setTheme } = useTheme();
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.userInfo)
    const refreshJWT = localStorage.getItem("refreshJWT")
    useEffect(() => {
        // if (refreshJWT !== "") {
        //     return toast.success('User LogIn success')
        // }
    }, [user, refreshJWT])

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
                <DropdownMenuItem onClick={() => {
                    console.log('first')
                }}>Profile</DropdownMenuItem>
                <DropdownMenuItem><Link to={"/product/create"}>Create Product</Link></DropdownMenuItem>
                <DropdownMenuItem><Link to={"/scan-product"}>Update Product</Link></DropdownMenuItem>

                <DropdownMenuItem>{user?._id !== "" ?
                    <Link to={"/sign-in"}>Log In</Link>
                    : <Link to={"/sign-up"}>Log out</Link>}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
