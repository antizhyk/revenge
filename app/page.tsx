"use client"
import AboutSection from "@/components/AboutSection";
import DescriptionSection from "@/components/DescriptionSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import Layout from "@/components/Layout";
import SubscriptionSection from "@/components/SubscriptionSection";
import TechnologySection from "@/components/TechnologySection";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo')
    if (scrollTo) {
      const element = document.getElementById(scrollTo)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [searchParams])

  
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

