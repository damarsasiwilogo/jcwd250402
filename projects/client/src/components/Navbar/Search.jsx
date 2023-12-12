import React, { useState, useCallback } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const [showSearch, setShowSearch] = useState(false);
  const toggleSearch = useCallback(() => {
    setShowSearch((prev) => !prev);
  }, []);

  return (
    <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="flex flex-row items-center justify-between text-black">
        <div className="px-6 text-sm font-semibold font-primary">Anywhere</div>
        <div className="hidden md:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
          Any Week
        </div>
        <div className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
          {/* <div className="hidden sm:block">Add Guests</div> */}
          <div className="p-2 text-white bg-[#0256EE] border rounded-full">
            <BiSearch height={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
