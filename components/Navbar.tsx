"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div
        className="
        flex items-center justify-between
        w-[85%] max-w-[1100px]
        px-10 py-2
        bg-white/80 backdrop-blur-md
        border border-gray-200
        rounded-full
        shadow-md
      "
      >
        {/* LEFT */}
        <Link href="/" className="select-none text-lg tracking-[0.08em]">
          <span className="font-semibold text-black">SUMAN</span>
          <span className="font-light text-gray-700 ml-1">MCQ</span>
        </Link>

        {/* CENTER */}
        <div className="hidden md:flex items-center gap-10 text-gray-700 text-sm">
          {/* Services Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-black cursor-pointer font-medium py-1 transition-colors"
            >
              <span>Services</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180 text-black" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="
                  absolute top-full left-0 mt-2 w-52
                  bg-white/95 backdrop-blur-lg
                  border border-gray-200/80
                  rounded-2xl
                  shadow-xl
                  py-2
                  animate-in fade-in slide-in-from-top-2 duration-150
                "
              >
                <Link
                  href="/instagram-reel-download"
                  onClick={() => setDropdownOpen(false)}
                  className="
                    flex items-center gap-3 px-4 py-2.5
                    text-gray-700 hover:text-black hover:bg-gray-100/80
                    transition-colors text-sm font-medium
                  "
                >
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow-sm">
                    🎬
                  </span>
                  <div>
                    <div className="leading-tight">IG Reel Download</div>
                    <div className="text-[11px] text-gray-400 font-normal">Free HD downloader</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <span className="hover:text-black cursor-pointer">About</span>
          <span className="hover:text-black cursor-pointer">Blog</span>
        </div>

        {/* RIGHT */}
        <div>
          <Link
            href="/instagram-reel-download"
            className="bg-black text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-block"
          >
            Reel Downloader
          </Link>
        </div>
      </div>
    </div>
  );
}
