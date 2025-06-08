import { useEffect, useRef, useState } from "react";

type SearchInputProps<T> = {
    placeholder?: string;
    data: T[];
    searchKeys: (keyof T)[]; // The key to filter on (e.g., "name")
    setFilteredData: (filtered: T[]) => void;
    className?: string;
};

const SearchInput = <T,>({
    placeholder = "Search...",
    data,
    searchKeys,
    setFilteredData,
    className,
}: SearchInputProps<T>) => {
    const [searchQuery, setSearchQuery] = useState("");
    const prevFilteredRef = useRef<T[]>([]);

    useEffect(() => {
        let filtered: T[];

        if (searchQuery.trim() === "") {
            filtered = data;
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = data.filter((item) =>
                searchKeys.some((key) =>
                    String(item[key]).toLowerCase().includes(lowerQuery)
                )
            );
        }

        if (JSON.stringify(prevFilteredRef.current) !== JSON.stringify(filtered)) {
            prevFilteredRef.current = filtered;
            setFilteredData(filtered);
        }
    }, [searchQuery, data, searchKeys, setFilteredData]);

    return (
        <div className={`flex flex-wrap justify-end items-center gap-4 py-2 me-1 ${className}`}>
            <div className="relative w-full max-w-xs">
                <input
                    className="p-2 w-full border text-sm md:text-base rounded-md pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-1 z-10 flex text-sm md:text-base p-2 rounded-md hover:bg-slate-300 items-center text-gray-600 cursor-pointer"
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
