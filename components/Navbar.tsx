"use client";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">

      <div className="
        flex items-center justify-between
        w-[85%] max-w-[1100px]
        px-10 py-2
        bg-white/10 backdrop-blur-md
        border border-gray-200
        rounded-full
        shadow-md
      ">

        {/* LEFT */}
       <div className="select-none text-lg tracking-[0.08em]">
       <span className="font-semibold text-black">SUMAN</span>
       <span className="font-light text-gray-700 ml-1">MCQ</span>
       </div>

        {/* CENTER */}
        <div className="hidden md:flex gap-10 text-gray-700 text-sm">
          
<div className="relative group">
  <button className="flex items-center gap-2 hover:text-black cursor-pointer">
    Services
    <svg
      className="w-4 h-4 transition-transform group-hover:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m6 9 6 6 6-6"
      />
    </svg>
  </button>

  <div className="absolute left-0 top-full pt-4 w-56 hidden group-hover:block">
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-2">
      <a
        href="/services/seo"
        className="block px-4 py-3 rounded-xl hover:bg-gray-100"
      >
        SEO Services
      </a>

      <a
        href="/services/web-development"
        className="block px-4 py-3 rounded-xl hover:bg-gray-100"
      >
        Web Development
      </a>

      <a
        href="/services/digital-marketing"
        className="block px-4 py-3 rounded-xl hover:bg-gray-100"
      >
        Digital Marketing
      </a>
    </div>
  </div>
</div>

          <span className="hover:text-black cursor-pointer">About</span>
          <span className="hover:text-black cursor-pointer">Blog</span>
        </div>

        {/* RIGHT */}
        <div>
          <button className="bg-black text-white px-5 py-1.5 rounded-full text-sm">
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
}