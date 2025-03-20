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
  const { open } = useAppSelector((s) => s.sidebar);
  const [results, setResults] = useState<IResults[] | []>([]);
 

  return (
    <div className="p-4 shadow-sm sticky top-0 rounded-md z-10 flex flex-col justify-center mx-auto w-full bg-primary">
      <div className="flex justify-between">
        {/* Header Content */}
        <div className="flex w-full gap-2 justify-start items-center text-md font-bold leading-none">
          <Button
            variant={"link"}
            onClick={() => {
              dispatch(toggleSideBar());
            }}
            className="p-2 hover:bg-gray-300 bg-primary-foreground"
          >
            {open ? (
              <RxCross1 className="text-red-500 bg-white" size={20} />
            ) : (
              <GiHamburgerMenu size={20} />
            )}
          </Button>
          <span className="text-primary-foreground p-2">
            <Link to={"/"}>
              <img
                src="/assets/shahKiranaPasal.png"
                className="w-16 h-16 object-contain rounded-full"
                alt="Shah Kirana Pasal Logo"
              />

            </Link>
          </span>
        </div>
        <div className="hidden md:flex w-full justify-start gap-2">
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
        <div className="flex w-full items-center justify-end gap-1">
          <Cart />
          <div className="w-fit">
            <Profile />
          </div>
        </div>
      </div>

      {/* Search Bar and Results */}
      <div className="relative flex flex-col justify-center items-center w-full mx-auto mt-2">
        <SearchBar
          data={data}
          types={types}
          setData={setData}
          results={results}
          setResults={setResults}
        />
        {results.length > 0 && (
 
          <div  className="absolute rounded-tl-md mx-auto top-full left-0 w-full">
            <ResultsComponent results={results} setResults={setResults} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
