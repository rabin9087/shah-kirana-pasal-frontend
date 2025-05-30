import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleSideBar } from "@/redux/sidebar.slice";
import SearchBar, { ResultsComponent } from "./Search";
import { GiHamburgerMenu } from "react-icons/gi";
import Cart from "./Cart";
import { RxCross1 } from "react-icons/rx";
import { Profile } from "../Profile";
import { IProductTypes } from "@/types/index";
import { useState } from "react";
import logo from "/assets/shahKiranaPasal.png"

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
  {
    name: "Store",
    path: "/store",
  },
  {
    name: "Sales",
    path: "/storeSales",
  },
];

interface IHeaderProps {
  types?: string;
  setData?: (data: IProductTypes[]) => void;
  data?: IProductTypes[];
}

type IResults = {
  _id: string;
  name: string;
  parentCategoryID: string;
};

const Header: React.FC<IHeaderProps> = ({ data, types, setData }) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.userInfo);
  const { open } = useAppSelector((s) => s.sidebar);
  const [results, setResults] = useState<IResults[] | []>([]);
  
  return (
    <div className="p-2 shadow-sm sticky top-0 rounded-md z-10 flex flex-col justify-center mx-auto w-full bg-primary">
      <div className="flex justify-between">
        {/* Header Content */}
        <div className="flex w-full gap-2 justify-start items-center text-md font-bold leading-none">
          <Button
            variant={"link"}
            type="button"
            onClick={() => {
              dispatch(toggleSideBar());
            }}
            className="p-2 h-12 w-12 bg-white/10"
          >
            {open ? (
              <RxCross1 className="text-white font-bold" size={30}
              />
            ) : (
                <GiHamburgerMenu className="hover:text-gray-400 text-white font-bold" size={30} height={30} width={30} />
            )}
          </Button>
          <span className="text-primary-foreground p-2">
            <Link to={"/"}>
              <img
                src={logo}
                className="w-10 h-10 object-contain rounded-full"
                alt="Shah Kirana Pasal Logo"
              />

            </Link>
          </span>
        </div>
        <div className="hidden md:flex w-full justify-start gap-2">
          <div className="md:flex hidden gap-2 items-center justify-center">
            {links
              .filter((item) => {
                if (item.name === "Store" || item.name === "Sales") {
                  return user?.role === "ADMIN" || user?.role === "SUPERADMIN" || user?.role === "STOREUSER";
                }
                return true;
              })
              .map((item) => (
                <Link
                  to={item.path}
                  key={item.name}
                  className={`font-semibold p-2 rounded-sm transition-colors duration-200
                    ${pathname === item.path
                      ? "text-white bg-white/10 hover:no-underline" // active item: light background, no underline
                      : "text-primary-foreground hover:underline hover:text-white/80" // inactive: underline and lighter text on hover
                    }`}
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>

        {(user.role === "STOREUSER" || user.role === "ADMIN" || user.role === "SUPERADMIN") &&
          <div className="flex md:hidden gap-2 items-center justify-center">
            <Link to={"/store"}
              className="text-white hover:underline px-3 py-1 rounded-md font-semibold "
            >
              Store
            </Link>
            <Link to={"/storeSales"}
              className="text-white hover:underline px-3 py-1 rounded-md font-semibold "
            >
              Sales
            </Link>
          </div>}
        <div className="flex w-full items-center justify-end gap-1">
          <Cart />
          <div className="w-fit">
            <Profile />
          </div>
        </div>
      </div>

      {/* Search Bar and Results */}
      <div className="relative flex flex-col justify-center items-center w-full mx-auto">
        <SearchBar
          data={data}
          types={types}
          setData={setData}
          results={results}
          setResults={setResults}
        />
        {results.length > 0 && (

          <div className="absolute rounded-tl-md mx-auto top-full left-0 w-full">
            <ResultsComponent results={results} setResults={setResults} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
