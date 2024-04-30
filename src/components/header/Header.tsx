import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { PiHamburger } from "react-icons/pi";
import { useAppDispatch } from "@/hooks";
import { toggleSideBar } from "@/redux/sidebar.slice";
const Header = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="p-4 border shadow-sm sticky top-0 rounded-md z-50 bg-inherit flex justify-between">
      <div className="flex gap-2 justify-center items-center text-xl font-bold leading-none">
        <Button
          variant={"ghost"}
          onClick={() => {
            dispatch(toggleSideBar());
          }}
        >
          <PiHamburger size={35} />
        </Button>
        <span className="text-red-500">Shah Shop</span>
      </div>
      <div className="flex gap-5">
        <Link to="/">
          <Button className="rounded-full" variant={"destructive"}>
            Home
          </Button>
        </Link>
        <Link to="/">
          <Button className="rounded-full" variant={"secondary"}>
            About
          </Button>
        </Link>
        <Link to="/">
          <Button className="rounded-full" variant={"secondary"}>
            Contact
          </Button>
        </Link>
      </div>
      <div className="flex gap-4">
        <Link to="/sign-in">
          <Button className="rounded-full" variant={"destructive"}>
            Login
          </Button>
        </Link>
        <Link to="/sign-up">
          <Button className="rounded-full" variant={"outline"}>
            Signup
          </Button>{" "}
        </Link>

        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
