import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}