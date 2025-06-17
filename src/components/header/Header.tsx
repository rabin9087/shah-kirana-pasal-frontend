import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";
import SearchBar, { ResultsComponent } from "./Search";
import Cart from "./Cart";
import { Profile } from "../Profile";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleSideBar } from "@/redux/sidebar.slice";
import { IProductTypes } from "@/types/index";
import logo from "/assets/shahKiranaPasal.png";
import { RxCross1 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Store", path: "/store", roles: ["ADMIN", "SUPERADMIN", "STOREUSER"] },
  { name: "Sales", path: "/storeSales", roles: ["ADMIN", "SUPERADMIN", "STOREUSER"] },
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
  const [results, setResults] = useState<IResults[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
  const hasAccess = (roles?: string[]) =>
    !roles || roles.includes(user?.role);

  const filteredLinks = links.filter(link => hasAccess(link.roles));

  const renderNavLinks = (isMobile = false) => (
    <div className={`${isMobile ? "md:hidden" : "hidden md:flex"} gap-2 items-center justify-center`}>
      {filteredLinks
        .filter(link =>
          isMobile ? ["Store", "Sales"].includes(link.name) : true
        )
        .map(link => (
          <Link
            key={link.name}
            to={link.path}
            className={`font-semibold p-2 rounded-sm transition-colors duration-200 ${pathname === link.path
              ? "text-white bg-white/10 hover:no-underline"
              : "text-primary-foreground hover:underline hover:text-white/80"
              }`}
          >
            {link.name}
          </Link>
        ))}
    </div>
  );

  return (
    <div className="p-2 shadow-sm sticky top-0 rounded-md z-10 flex flex-col justify-center mx-auto w-full bg-primary">
      <div className="flex justify-between items-center">
        {/* Left Section: Hamburger + Logo */}
        <div className="flex w-full gap-2 items-center text-md font-bold">
          <Button
            variant="link"
            type="button"
            onClick={() => dispatch(toggleSideBar())}
            className="p-2 h-12 w-12 bg-white/10"
            disabled={open}
          >
            {open ? (
              <RxCross1 className="text-white" size={30} />
            ) : (
              <GiHamburgerMenu className="text-white hover:text-gray-400" size={30} />
            )}
          </Button>

          <span className="text-primary-foreground p-2">
            <Link to="/">
              <img
                src={logo}
                alt="Shah Kirana Pasal Logo"
                className="w-10 h-10 object-contain rounded-full"
              />
            </Link>
          </span>
        </div>

        {/* Center Nav Links (Desktop) */}
        {renderNavLinks(false)}

        {/* Mobile Store/Sales Nav */}
        {renderNavLinks(true)}

        {/* Right Section: Cart + Profile */}
        <div className="flex w-full items-center justify-end gap-1">
          <FaSearch
            onClick={() => setShowSearchBar(!showSearchBar)}
            className="text-white" size={20} />
          <Cart />
          <Profile />
        </div>
      </div>

      {/* Search Section */}
      {showSearchBar  && <div className="relative flex flex-col justify-center items-center w-full mx-auto">
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
      </div>}
    </div>
  );
};

export default Header;
