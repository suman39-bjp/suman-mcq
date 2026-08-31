import AnnouncementBar from "@/components/fanmerch/AnnouncementBar";
import Header from "@/components/fanmerch/Header";
import Hero from "@/components/fanmerch/Hero";
import Benefits from "@/components/fanmerch/Benefits";
import Categories from "@/components/fanmerch/Categories";

export default function FanMerchPage() {
  return (
    <main className="min-h-screen bg-[#070b12]">
      <AnnouncementBar />
      <Header />
      <Hero />
      <Benefits />
      <Categories />
    </main>
  );
}