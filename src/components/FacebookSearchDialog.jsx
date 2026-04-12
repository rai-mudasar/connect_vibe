"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounced";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserByFirstName } from "@/actions/userActions";
import SafeImage from "./SafeImage";
import Link from "next/link";

export function FacebookSearchDialog() {
  const [inputData, setInputData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchedData, setSearchedData] = useState([]);

  const debouncedSearchValue = useDebounce(inputData, 500);

  useEffect(() => {
    getSearchData();
  }, [debouncedSearchValue]);

  const getSearchData = async () => {
    setIsLoading(true);
    if (debouncedSearchValue !== "") {
      const response = await getUserByFirstName(debouncedSearchValue);
      if (response.success) {
        setSearchedData(response.data);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="w-40 md:w-60 h-8 md:h-10 text-[#333334] dark:text-white bg-[#F0F2F5] dark:bg-neutral-700 rounded-2xl flex items-center justify-center pl-2 md:pl-6 gap-2 ">
        <Search size={28} className="text-neutral-400 stroke-[2px]" />
        <Input
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder={"Search Facebook"}
          className={
            "bg-transparent border-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 w-full h-full text-sm -ml-3 rounded-2xl shadow-none focus-visible:ring-0"
          }
        />
      </div>

      <div className="w-full max-h-100 bg-white absolute mt-2">
        {inputData !== "" && !isLoading && searchedData.length === 0 && (
          <p>No data found! Search anything else.</p>
        )}

        {inputData !== "" &&
          !isLoading &&
          searchedData.length > 0 &&
          searchedData.map((user) => (
            <Link
              key={user._id}
              href={`/user/${user.username}`}
              onClick={() => setInputData('')}
              className=" bg-white hover:bg-neutral-100 flex flex-row gap-3 items-center pl-5 py-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full relative overflow-hidden z-50">
                <SafeImage
                  src={user.profileImageUrl}
                  alt={"Searched user profileImage"}
                  fill
                  className={"object-contain"}
                />
              </div>
              <div>
                <h1 className="font-semibold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-[12px] text-gray-500">
                  {user.location !== "None" && `${user.location} `}
                  {user.location !== "None" &&
                    user.occupation !== "None" &&
                    "| "}
                  {user.occupation !== "None" && user.occupation}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
