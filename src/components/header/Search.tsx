import { Search } from "lucide-react";
const SearchBar = () => {
  return (
    <div className="relative inline-flex gap-2 w-full lg:w-fit items-center justify-center">
      <input type="text" className="w-full md:w-[750px] lg;w-[750px] border-2 rounded-full border-primary mx-2 ps-4 py-1 text-primary bg-secondary inline-flex hover:cursor-pointer" placeholder="Search ..." />
      <Search className="absolute right-4 md:right-6" />
    </div>
  )
}

export default SearchBar