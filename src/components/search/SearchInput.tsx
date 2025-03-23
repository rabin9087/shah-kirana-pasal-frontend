import { useEffect, useState } from "react";

type SearchInputProps<T> = {
    placeholder?: string;
    data: T[];
    searchKey: keyof T; // The key to filter on (e.g., "name")
    setFilteredData: (filtered: T[]) => void;
    className?: string;
};

const SearchInput = <T,>({
    placeholder = "Search...",
    data,
    searchKey,
    setFilteredData,
    className,
}: SearchInputProps<T>) => {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) =>
                (item[searchKey] as unknown as string)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, data, searchKey, setFilteredData]);

    return (
        <div className={`flex flex-wrap justify-end items-center gap-4 py-2 me-4 ${className}`}>
            <div className="relative w-full max-w-xs">
                <input
                    className="p-2 w-full border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-2 z-10 flex text-base me-2 p-2 rounded-md hover:bg-slate-300 items-center text-gray-600 cursor-pointer"
                        onClick={() => setSearchQuery("")}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchInput;
