import { searchUser } from "@/axios/search/search";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ICustomer, setCustomer } from "@/redux/user.slice";
import { IProductTypes, IUser } from "@/types/index";
import { useEffect, useRef, useState } from "react";

// Types
export type IProductResults = {
    _id: string;
    name: string;
    alternateName?: string;
    parentCategoryID?: string;
    qrCodeNumber?: string;
};

export type IUserResults = {
    _id: string;
    fName: string;
    lName: string,
    email: string,
    phone: string
};

interface ISearchProps {
    types: "products" | "users" | "category";
    placeholder?: string;
    results: IProductResults[] | IUserResults[];
    setResults: React.Dispatch<React.SetStateAction<IUserResults[] | IProductResults[]>>;
    localData?: IProductTypes[] | IUser[];
    setLocalData?: (data: any[]) => void;
}

// Debounce hook
export const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

// SearchBar component
const SearchBarComponent: React.FC<ISearchProps> = ({
    types,
    placeholder,
    setResults,
    setLocalData,
}) => {
    const { products } = useAppSelector((state) => state.productInfo);
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Local search fallback if needed
        if (setLocalData && value.trim() !== "") {
            if (types === "users") {
                const filtered = products.filter((item) =>
                    item.name.toLowerCase().includes(value.toLowerCase())
                );
                setLocalData(filtered);
            }
        }
    };

    const handleClearInput = () => {
        setSearchTerm("");
        setResults([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearch) {
                try {
                    const response = await searchUser(debouncedSearch); // Pass `types` to search API if needed
                    if (response?.status === "success") {
                        setResults(response.result as any);
                    }
                } catch (error) {
                    console.error(`Error fetching ${types} search results:`, error);
                }
            } else {
                setResults([]);
            }
        };

        fetchResults();
    }, [debouncedSearch, types, setResults]);

    return (
        <div className="relative w-fit lg:w-fit inline-flex items-center">
            <input
                type="text"
                ref={inputRef}
                className="w-full border-2 rounded-md border-primary ps-4 py-1 text-sm bg-secondary"
                placeholder={placeholder || `Search ${types}...`}
                onChange={handleInputChange}
            />
            {searchTerm && (
                <button
                    onClick={handleClearInput}
                    className="absolute right-4 text-black cursor-pointer hover:text-red-500"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default SearchBarComponent;

// Reusable results component
export const SearchResults: React.FC<{
    results: IUserResults[];
    setResults: (results: IProductResults[] | IUserResults[]) => void;
    routePrefix: string;
}> = ({ results, setResults }) => {
    const dispatch = useAppDispatch()
    const resultsRef = useRef<HTMLDivElement | null>(null);

    const handelOnSetCustomer = (item: ICustomer, e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        console.log("CLicked:", item.fName);
        dispatch(setCustomer(item));
        setResults([]);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
                setResults([]);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setResults]);

    return (
        <div
            ref={resultsRef}
            className="absolute w-fit md:w-fit bg-white shadow-md z-30 max-h-80 overflow-auto"
        >
            {results.map((item) => (
                <p
                    key={item._id}
                    onClick={(e) => handelOnSetCustomer(item as ICustomer, e)}
                    className="block p-3 z-30 hover:bg-gray-100 border-b text-red-500 text-sm hover:underline cursor-pointer"
                >
                    {item?.fName + " " + item?.lName} | {item?.phone}<br />
                    {item?.email} <br />

                </p>
            ))}
        </div>
    );
};
