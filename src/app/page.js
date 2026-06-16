import Brands from "@/components/Brands";
import FAQSection from "@/components/Faq";
import HeroSlider from "@/components/HomeSlider";
import CustomerReviews from "@/components/Review";
import SpecialProducts from "@/components/SpecialProducts";
import LegitSlider from "@/components/LegitSlider";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <HeroSlider/>
    <Brands/>
    <SpecialProducts/>
    <LegitSlider/>
    <CustomerReviews/>
     <SpecialProducts title="Products That May Interest You"/>
     <FAQSection/>
    </>
  );
}
