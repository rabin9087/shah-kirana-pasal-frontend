import { searchItem } from "@/axios/search/search";
import { useAppSelector } from "@/hooks";
import { IProductTypes } from "@/types/index";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface ISearchProps {
  data?: IProductTypes[],
  setData?: (data: IProductTypes[]) => void,
  types?: string,
  placeholder?: string
  results: IResults[] | [],
  setResults: (results: IResults[] | []) => void
}

export type IResults = {
  _id: string,
  name: string,
  alternateName?: string,
  parentCategoryID: string,
  qrCodeNumber?: string,
  price: number,
  salesPrice?: number,
  thumbnail?: string,
}

const SearchBar: React.FC<ISearchProps> = ({ data = [], setData, types, placeholder, setResults }) => {
  const { products } = useAppSelector(state => state.productInfo)
  const inputRef = useRef<HTMLInputElement>(null);

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setDebouncedValue(value)
    if (!setData) {
      return
    }
    let matchedFilter: IProductTypes[]
    switch (types) {
      case "products":
        if (value.trim() === "") {
          return setData(data)
        }

        matchedFilter = products.filter(item => item.name.toLowerCase().includes(value.toLocaleLowerCase()) || item?.alternateName || item?.description?.toLowerCase().includes(value))
        setData(matchedFilter)
        break;
      case "category":
        if (value.trim() === "") {
          return setData(data)
        }
        break;

      case "user":
        if (value.trim() === "") {
          return setData(data)
        }

        matchedFilter = products.filter(item => item.name.toLowerCase().includes(value.toLocaleLowerCase()) || item?.description?.toLowerCase().includes(value))
        setData(matchedFilter)
        break;
    }
  }

  const handleClearInput = () => {
    setDebouncedValue("");
    setResults([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const [debouncedValue, setDebouncedValue] = useState("");
  // const [results, setResults] = useState<IResults[] | []>([]);

  const debouncedQuery = useDebounce(debouncedValue, 500)

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery) {
        try {
          const response = await searchItem(debouncedQuery);
          if (response?.status === "success") {
            setResults(response?.result as IResults[]);
          }

        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative inline-flex w-full lg:w-fit items-center justify-start">
      <input type="text"
        ref={inputRef}
        className="w-full md:w-[750px] lg:w-[750px] border-2 rounded-md border-primary ps-4 py-1 text-primary bg-secondary inline-flex hover:cursor-pointer"
        placeholder={placeholder ? placeholder : "Search ..."}
        onChange={handelOnChange}
      />
      {debouncedValue &&
        <div className="text-center absolute right-4 md:right-4 size-6 cursor-pointer hover:bg-gray-300" onClick={handleClearInput} >
          <span >X</span>
        </div>}
    </div>
  )
}

export default SearchBar

export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if the value changes before the delay ends
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ResultsComponent = ({ results, setResults }: { results: IResults[] | [], setResults: (result: []) => void }) => {
  const { language } = useAppSelector((state) => state.settings)

  const resultsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setResults([]); // Close results
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={resultsRef} className=" relative w-full md:w-[750px] lg:w-[750px] mx-auto overflow-y-auto max-h-64 md:max-h-96">
      {results?.length > 0 &&
        results?.map((item) => (
          <Link
            onClick={() => setResults([])}
            to={`/product/${item.qrCodeNumber}`}
          >
            <div
              className="flex items-center justify-between p-3 border-b-gray-500 bg-white  last:border-none 
                     hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {/* Thumbnail if exists */}
              {item?.thumbnail && (
                <img
                  src={item?.thumbnail}
                  alt={item.name}
                  className="w-8 h-8 object-cover rounded-md mr-3"
                />
              )}

              {/* Product info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {language === "en"
                    ? item.name
                    : item.alternateName !== ""
                      ? item.alternateName
                      : item.name}
                </p>
              </div>

              {/* Price */}
              <p className="text-sm me-2 font-semibold text-green-600 whitespace-nowrap">
                ${item.salesPrice ? item.salesPrice : item.price}
              </p>
            </div>
          </Link>
        ))
      }
    </div>
  );
};


