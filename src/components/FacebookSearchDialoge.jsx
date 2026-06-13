"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounced";
import { useEffect, useRef, useState } from "react";
import { getUserByFirstName } from "@/actions/userActions";
import Link from "next/link";
import SafeImage from "./SafeImage";

export function FacebookSearchDialog() {
  const [inputData, setInputData]     = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const mobileInputRef                = useRef(null);
  const dropdownRef                   = useRef(null);

  const debouncedSearchValue = useDebounce(inputData, 400);

  // ── fetch on debounced value change ───────────────────────────────────────
  useEffect(() => {
    if (debouncedSearchValue.trim() === "") {
      setSearchedData([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const response = await getUserByFirstName(debouncedSearchValue.trim());
        if (!cancelled && response.success) setSearchedData(response.data);
      } catch (_) {
        // silent
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debouncedSearchValue]);

  // ── focus mobile input when dialog opens ──────────────────────────────────
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    } else {
      reset();
    }
  }, [mobileOpen]);

  // ── close dropdown on outside click (desktop) ────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchedData([]);
        setInputData("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const reset = () => {
    setInputData("");
    setSearchedData([]);
    setIsLoading(false);
  };

  const handleSelect = () => {
    reset();
    setMobileOpen(false);
  };

  // ── shared results list ───────────────────────────────────────────────────
  const Results = () => {
    if (inputData === "") return null;
    if (isLoading) return (
      <div className="flex items-center justify-center py-6">
        <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
    if (searchedData.length === 0) return (
      <p className="text-sm text-label text-center py-5 px-3">
        No results for &ldquo;{inputData}&rdquo;
      </p>
    );
    return (
      <>
        {searchedData.map((user) => (
          <Link
            key={user._id}
            href={`/user/${user.username}`}
            onClick={handleSelect}
            className="flex flex-row gap-3 items-center px-3 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0 bg-bg border border-border">
              <SafeImage
                src={user.profileImageUrl}
                alt={`${user.firstName} profile`}
                fill
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-sm text-primary truncate">
                {user.firstName} {user.lastName}
              </h1>
              {(user.location !== "None" || user.occupation !== "None") && (
                <p className="text-[11px] text-label truncate">
                  {user.location !== "None" && user.location}
                  {user.location !== "None" && user.occupation !== "None" && " | "}
                  {user.occupation !== "None" && user.occupation}
                </p>
              )}
            </div>
          </Link>
        ))}
      </>
    );
  };

  return (
    <>
      {/* ── DESKTOP: inline search box (md and above) ── */}
      <div ref={dropdownRef} className="relative hidden md:block">
        <div className="w-52 lg:w-64 h-10 bg-bg rounded-2xl flex items-center pl-3 gap-1.5 border border-border">
          <Search className="w-4 h-4 text-label shrink-0 stroke-[2px]" />
          <Input
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Search ConnectVibe"
            className="bg-transparent border-0 placeholder:text-label w-full h-full text-sm rounded-2xl shadow-none focus-visible:ring-0 p-0"
          />
          {inputData && (
            <button onClick={reset} className="pr-2 text-label hover:text-primary transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop dropdown */}
        {inputData !== "" && (
          <div className="absolute top-full left-0 mt-2 w-80 max-h-96 bg-label2 rounded-2xl border border-border shadow-lg overflow-y-auto hide-scrollbar z-50 py-2">
            <Results />
          </div>
        )}
      </div>

      {/* ── MOBILE: icon trigger (below md) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center text-label hover:text-primary transition-colors"
        aria-label="Open search"
      >
        <Search className="w-4 h-4 stroke-[2px]" />
      </button>

      {/* ── MOBILE: full-screen search dialog ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex flex-col" onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false); }}>
          <div className="bg-label2 rounded-b-2xl shadow-xl">

            {/* Dialog header */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <div className="flex-1 h-10 bg-bg rounded-2xl flex items-center pl-3 gap-1.5 border border-border">
                <Search className="w-4 h-4 text-label shrink-0 stroke-[2px]" />
                <Input
                  ref={mobileInputRef}
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Search ConnectVibe"
                  className="bg-transparent border-0 placeholder:text-label w-full h-full text-sm rounded-2xl shadow-none focus-visible:ring-0 p-0"
                />
                {inputData && (
                  <button onClick={reset} className="pr-2 text-label">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-primary shrink-0 px-1"
              >
                Cancel
              </button>
            </div>

            {/* Mobile results */}
            {inputData !== "" && (
              <div className="max-h-[60vh] overflow-y-auto hide-scrollbar px-3 pb-4">
                <Results />
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
