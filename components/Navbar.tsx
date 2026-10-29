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
          <span className="hover:text-black cursor-pointer">Services</span>
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