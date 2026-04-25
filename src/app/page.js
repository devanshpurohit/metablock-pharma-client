import Brands from "@/components/Brands";
import FAQSection from "@/components/Faq";
import HeroSlider from "@/components/HomeSlider";
import CustomerReviews from "@/components/Review";
import SpecialProducts from "@/components/SpecialProducts";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <HeroSlider/>
    <Brands/>
    <SpecialProducts/>
    <CustomerReviews/>
     <SpecialProducts/>
     <FAQSection/>
    </>
  );
}
