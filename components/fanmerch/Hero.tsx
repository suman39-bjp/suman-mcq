import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#070b12]">
      
      {/* Hero Image */}
      <div className="relative aspect-[1920/700] w-full min-h-[420px]">
        <Image
          src="/image/hero-banner.webp"
          alt="FanMerchStore Anime Merchandise"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            
            <div className="mb-5 inline-flex rounded-full border border-pink-400/70 bg-black/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              Limited Time Only
            </div>

            <h1 className="text-5xl font-black uppercase leading-none sm:text-6xl lg:text-8xl">
              Premium
              <br />

              <span className="text-pink-500">
                Anime Store
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-white/90 sm:text-lg">
              Discover premium anime merchandise made for true fans.
            </p>

            <button className="group mt-7 inline-flex items-center gap-3 rounded-full bg-pink-500 px-8 py-4 text-sm font-bold uppercase tracking-wide shadow-xl transition duration-300 hover:scale-105 hover:bg-pink-600">
              Shop Now

              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

          </div>
        </div>

        {/* Previous */}
        <button
          aria-label="Previous slide"
          className="absolute left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          aria-label="Next slide"
          className="absolute right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          <span className="h-2.5 w-8 rounded-full bg-pink-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
        </div>

      </div>
    </section>
  );
}