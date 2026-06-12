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
  let isMobile = true;

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
    <div className={`relative`}>
      <div className="w-45 h-10 text-label bg-bg rounded-2xl flex items-center justify-center pl-2 gap-1">
        <Search className="w-10 md:w-5 text-label stroke-[2px]" />
        <Input
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder={"Search Connect Vibe"}
          className={
            "bg-transparent border-0 placeholder:text-label w-full h-full text-sm -ml-3 rounded-2xl shadow-none focus-visible:ring-0"
          }
        />
      </div>

      <div className="w-80 max-h-150 flex flex-col gap-2 bg-label2 absolute px-3 mt-2 overflow-y-scroll hide-scrollbar">
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
              className=" bg-bg hover:bg-card border border-border rounded-2xl flex flex-row gap-3 items-center pl-5 py-3 cursor-pointer"
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
                <h1 className="font-semibold text-primary">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-[12px] text-label">
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
