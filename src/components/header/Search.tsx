import { useAppSelector } from "@/hooks";
import { IProductTypes } from "@/types";
import { Search } from "lucide-react";

interface ISearchProps {
  data?: IProductTypes[],
  setData?: (data: IProductTypes[]) => void,
  types?: string,
  placeholder?: string
}

const SearchBar: React.FC<ISearchProps> = ({ data = [], setData, types, placeholder }) => {

  const { products } = useAppSelector(state => state.productInfo)

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

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

    }


  }

  return (
    <div className="relative inline-flex gap-2 w-full lg:w-fit items-center justify-center">
      <input type="text"
        className="w-full md:w-[750px] lg;w-[750px] border-2 rounded-full border-primary mx-2 ps-4 py-1 text-primary bg-secondary inline-flex hover:cursor-pointer"
        placeholder={placeholder ? placeholder : "Search ..."}
        onChange={handelOnChange}
      />
      <Search className="absolute right-4 md:right-6" />
    </div>
  )
}

export default SearchBar