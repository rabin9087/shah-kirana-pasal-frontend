
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks";


export function Profile() {

    const { user } = useAppSelector(state => state.userInfo)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar >
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

                <DropdownMenuItem>{user?._id === "" ?
                    <Link to={"/sign-in"}>Log In</Link>
                    : <Link to={"/sign-up"}>Log out</Link>}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
