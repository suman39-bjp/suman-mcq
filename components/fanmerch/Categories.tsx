import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Action Figures",
    image: "/image/categories/action-figures.webp",
  },
  {
    title: "Clothing & Apparel",
    image: "/image/categories/clothing.webp",
  },
  {
    title: "Accessories & Gear",
    image: "/image/categories/accessories.webp",
  },
  {
    title: "Home Decor & Lights",
    image: "/image/categories/home-decor.webp",
  },
  {
    title: "Cosplay & Costumes",
    image: "/image/categories/cosplay.webp",
  },
  {
    title: "Plushies & Toys",
    image: "/image/categories/plushies.webp",
  },
];

export default function Categories() {
  return (
    <section className="bg-[#070b12] px-5 py-20 lg:px-8">

      {/* Heading */}
      <div className="mx-auto mb-10 max-w-[1400px] text-center">

        <div className="mb-4 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-pink-500" />

          <span className="h-2.5 w-2.5 rotate-45 border-2 border-pink-500" />

          <span className="h-px w-12 bg-gradient-to-l from-transparent to-pink-500" />
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Shop by Category
        </h2>

        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Find your favorite anime merch
        </p>

      </div>

      {/* Category Grid */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {categories.map((category) => (
          <a
            key={category.title}
            href="#"
            className="group relative h-[210px] overflow-hidden rounded-2xl border border-white/10 bg-[#111923]"
          >

            {/* Image */}
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10 transition duration-500 group-hover:from-black/75" />

            {/* Pink Glow */}
            <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl transition duration-500 group-hover:bg-pink-500/40" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">

              <h3 className="max-w-[220px] text-xl font-black uppercase leading-tight text-white">
                {category.title}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-3">
                <span>Shop Now</span>

                <ArrowRight className="h-4 w-4 text-pink-400" />
              </div>

            </div>

            {/* Hover Border */}
            <div className="absolute inset-0 rounded-2xl border border-transparent transition duration-300 group-hover:border-pink-500/60" />

          </a>
        ))}

      </div>

    </section>
  );
}