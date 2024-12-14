import AboutSection from "@/components/AboutSection";
import DescriptionSection from "@/components/DescriptionSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import Layout from "@/components/Layout";
import SubscriptionSection from "@/components/SubscriptionSection";
import TechnologySection from "@/components/TechnologySection";


export default function Home() {
  return (
    <Layout>
      <HeroSection />
      {/* <AboutSection /> */}
      {/* <GallerySection /> */}
      <DescriptionSection/>  
      <TechnologySection />
      <SubscriptionSection />
    </Layout>
  )
}

