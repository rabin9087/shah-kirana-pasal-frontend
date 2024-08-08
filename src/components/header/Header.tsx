import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleSideBar } from "@/redux/sidebar.slice";
import SearchBar from "./Search";
import { GiHamburgerMenu } from "react-icons/gi";
import Cart from "./Cart";
import { RxCross1 } from "react-icons/rx";
import { Profile } from "../Profile";
import { IProductTypes } from "@/types";

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

interface IHeaderProps {
  types?: string,
  setData?: (data: IProductTypes[]) => void
  data?: IProductTypes[]
}

const Header: React.FC<IHeaderProps> = ({ data, types, setData }) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  // const { user } = useAppSelector((state) => state.userInfor);
  const { open } = useAppSelector(s => s.sidebar)
  return (
    <div className="p-4 shadow-sm sticky top-0 rounded-md z-10 justify-center bg-primary">
      <div className="flex justify-between ">
        <div className="flex gap-2 justify-center items-center text-md font-bold leading-none">
          <Button
            variant={"link"}
            onClick={() => {
              dispatch(toggleSideBar());
            }}
            className="p-2 hover:bg-gray-300 bg-primary-foreground"
          >
            {open ? <RxCross1 className="text-red-500 bg-white" size={20} />
              :

              <GiHamburgerMenu size={20} />
            }

          </Button>
          <span className="text-primary-foreground p-2 hover:bg-gray-300">
            <Link to={"/"}>
              Shah Shop Logo
            </Link></span>

        </div>
        <div className="flex justify-between gap-2 mx-2">
          <div className="md:flex hidden gap-2 items-center justify-center">
            {links.map((item) => (
              <Link
                to={item.path}
                className={`${pathname === item.path ? " bg-secondary" : "text-primary-foreground"
                  } font-semibold p-2 rounded-sm`}
                key={item.name}
              >
                {item.name}
              </Link>
            ))}

          </div>


        </div>

        <div className="flex gap-4 items-center justify-end">
          <Cart />
          {/* <NavbarDemo /> */}
          <ThemeToggle />
          <Profile />
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-2">
        <SearchBar data={data} types={types} setData={setData} />
      </div>
    </div>
  );
};

export default Header;
