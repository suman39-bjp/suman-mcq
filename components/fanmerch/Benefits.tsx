import {
  ShieldCheck,
  Truck,
  RotateCcw,
  LockKeyhole,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% AUTHENTIC",
    description: "Official merch only",
  },
  {
    icon: Truck,
    title: "FAST SHIPPING",
    description: "Worldwide delivery",
  },
  {
    icon: RotateCcw,
    title: "EASY RETURNS",
    description: "30-day return policy",
  },
  {
    icon: LockKeyhole,
    title: "SECURE PAYMENT",
    description: "100% protected",
  },
];

export default function Benefits() {
  return (
    <section className="relative z-20 mx-auto -mt-10 w-[92%] max-w-[1280px]">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#151c25]/95 shadow-2xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
        
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className={`flex items-center gap-4 px-6 py-6 lg:px-8 ${
                index !== benefits.length - 1
                  ? "border-b border-white/10 lg:border-b-0 lg:border-r"
                  : ""
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Icon className="h-6 w-6 text-white" strokeWidth={1.7} />
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-wide text-white">
                  {benefit.title}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}