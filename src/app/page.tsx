import Hero from "@/components/home/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import PricingSection from "@/components/home/PricingSection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedCourses />
      <PricingSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
