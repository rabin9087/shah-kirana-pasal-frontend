import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { PiHamburger } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleSideBar } from "@/redux/sidebar.slice";


const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
import SearchBar from "./Search";

const Header = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userInfor);

  return (
    <div className="p-4 border shadow-sm sticky top-0 rounded-md z-50 bg-inherit flex justify-between">
      <div className="flex gap-2 justify-center items-center text-xl font-bold leading-none">
        <Button
          variant={"link"}
          onClick={() => {
            dispatch(toggleSideBar());
          }}
        >
          <PiHamburger size={35} />
        </Button>
        <span className="text-primary">Shah Shop</span>
      </div>
      <div className="flex gap-5 items-center">
        {links.map((item) => (
          <Link
            to={item.path}
            className={`${
              pathname === item.path ? " bg-secondary" : ""
            } font-semibold p-2 rounded-sm`}
            key={item.name}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex gap-4">{
        user?._id ? (<>
        <Link to="/sign-in">
          <Button className="rounded-full" variant={"destructive"}>
            Log out
          </Button>
        </Link>
        </>) : (<>
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
        </>)
      }
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
