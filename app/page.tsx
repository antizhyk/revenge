// pages/index.js
"use client"
import { Suspense } from 'react';
import DescriptionSection from "@/components/DescriptionSection"; // Server component (if possible)
import HeroSection from "@/components/HeroSection";        // Server component (if possible)
import Layout from "@/components/Layout";            // Server component (if possible)
import SubscriptionSection from "@/components/SubscriptionSection/SubscriptionSection"; // Server component (if possible)
import TechnologySection from "@/components/TechnologySection";  // Server component (if possible)
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Server Components: No access to useSearchParams!
const LayoutServer = ({ children }) => <Layout>{children}</Layout>;
const HeroSectionServer = () => <HeroSection />;
const DescriptionSectionServer = () => <DescriptionSection />;
const TechnologySectionServer = () => <TechnologySection />;
const SubscriptionSectionServer = () => <SubscriptionSection />;



function HomePageContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  return (
    <>  {/* Fragment to avoid unnecessary div */}
      <LayoutServer> {/* Use Server Components here */}
        <HeroSectionServer />
        <DescriptionSectionServer />
        <TechnologySectionServer />
        <SubscriptionSectionServer />
      </LayoutServer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}