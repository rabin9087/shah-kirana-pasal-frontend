import { Search } from "lucide-react";
const SearchBar = () => {
  return (
    <div className="relative inline-flex gap-2 items-center">
        <input type="text" className="w-[350px] border-2 rounded-full border-primary ps-4 py-1 text-primary bg-secondary inline-flex hover:cursor-pointer" placeholder="Search ..."/>
        <Search className="absolute right-4"/>
    </div>
  )
}

export default SearchBar