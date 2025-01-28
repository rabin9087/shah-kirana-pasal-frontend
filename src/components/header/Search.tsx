import { searchItem } from "@/axios/search/search";
import { useAppSelector } from "@/hooks";
import { IProductTypes } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ISearchProps {
  data?: IProductTypes[],
  setData?: (data: IProductTypes[]) => void,
  types?: string,
  placeholder?: string
  results: IResults[] | [],
  setResults: (results: IResults[] | []) => void
}

type IResults = {
  _id: string,
  name: string,
  parentCategoryID: string,
}

const SearchBar: React.FC<ISearchProps> = ({ data = [], setData, types, placeholder, setResults }) => {
  const { products } = useAppSelector(state => state.productInfo)


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

        matchedFilter = products.filter(item => item.name.toLowerCase().includes(value.toLocaleLowerCase()) || item.description.toLowerCase().includes(value))
        setData(matchedFilter)
        break;
      case "category":
        if (value.trim() === "") {
          return setData(data)
        }

        matchedFilter = products.filter(item => item.name.toLowerCase().includes(value.toLocaleLowerCase()) || item.description.toLowerCase().includes(value))
        setData(matchedFilter)
        break;
    }
  }

  const [debouncedValue, setDebouncedValue] = useState("");
  // const [results, setResults] = useState<IResults[] | []>([]);

  const debouncedQuery = useDebounce(debouncedValue, 500)

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery) {
        try {
          const response = await searchItem(debouncedQuery)
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
        className="w-full md:w-[750px] lg:w-[750px] border-2 rounded-md border-primary ps-4 py-1 text-primary bg-secondary inline-flex hover:cursor-pointer"
        placeholder={placeholder ? placeholder : "Search ..."}
        onChange={handelOnChange}
      />
      {/* <Search className="absolute right-4 md:right-6" /> */}
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

export const ResultsComponent = ({ results }: { results: IResults[] | [] }) => {
  const { categories } = useAppSelector((s) => s.categoryInfo);

  const getCategoryName = (parentCategoryID: string): string | undefined => {
    const category = categories.find((cat) => cat._id === parentCategoryID);
    return category?.slug; // Return the name if found, otherwise undefined
  };

  return (
    <div className="w-full">
      {results?.length > 0 &&
        results?.map((item) => (
          <div
            key={item?._id}
            className="p-2 last:border-none shadow-sm flex justify-between hover:shadow-md hover:rounded-md hover:bg-gray-100"
          >
            <Link
              to={`/products/search?searchTerm=${getCategoryName(item.parentCategoryID)}`}
            >
                <p className="text-black text-sm">{item?.name}</p>
            </Link>
          </div>
        ))
      }
    </div>
  );
};


