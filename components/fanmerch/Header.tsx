"use client";

import {
  Search,
  UserRound,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d14]/95 text-white backdrop-blur-xl">

      {/* Main Header */}
      <div className="mx-auto flex h-20 max-w-[1400px] items-center gap-6 px-5 lg:px-8">

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenu ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Logo */}
        <div className="min-w-fit">
          <div className="text-2xl font-black tracking-tight">
            <span className="text-red-500">FAN</span>
            <span className="text-blue-500">MERCH</span>
          </div>

          <div className="-mt-1 text-center font-serif text-sm italic text-gray-300">
            Store
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto hidden max-w-[650px] flex-1 md:block">
          <div className="flex h-11 items-center rounded-full border border-white/10 bg-white/[0.06] px-5 transition focus-within:border-pink-500/60 focus-within:bg-white/[0.09]">
            <input
              type="text"
              placeholder="Search for anime merch..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-5">

          {/* Currency */}
          <button className="hidden items-center gap-2 text-sm text-gray-300 lg:flex">
            <span>🇺🇸</span>
            <span>(US $)</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Account */}
          <button aria-label="Account">
            <UserRound className="h-5 w-5 transition hover:text-pink-500" />
          </button>

          {/* Cart */}
          <button className="relative" aria-label="Shopping cart">
            <ShoppingCart className="h-5 w-5 transition hover:text-pink-500" />

            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden border-t border-white/5 lg:block">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-center gap-12">

          <a
            href="#"
            className="relative text-sm font-semibold uppercase tracking-wide transition hover:text-pink-500"
          >
            Top Selling
            <span className="absolute -right-7 -top-4 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold">
              HOT
            </span>
          </a>

          <a
            href="#"
            className="text-sm font-semibold uppercase tracking-wide transition hover:text-pink-500"
          >
            Best Deals
          </a>

          <a
            href="#"
            className="relative text-sm font-semibold uppercase tracking-wide transition hover:text-pink-500"
          >
            New Arrivals
            <span className="absolute -right-7 -top-4 rounded bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold">
              NEW
            </span>
          </a>

          <a
            href="#"
            className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition hover:text-pink-500"
          >
            All Products
            <ChevronDown className="h-4 w-4" />
          </a>

        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <nav className="border-t border-white/10 bg-[#0d131c] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-5 text-sm font-semibold uppercase">
            <a href="#">Top Selling</a>
            <a href="#">Best Deals</a>
            <a href="#">New Arrivals</a>
            <a href="#">All Products</a>
          </div>
        </nav>
      )}
    </header>
  );
}