import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import ValueProposition from "@/components/landing/ValueProposition";
import ProcessSection from "@/components/landing/ProcessSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import CaseStudySection from "@/components/landing/CaseStudySection";
import PricingSection from "@/components/landing/PricingSection";
import CallToAction from "@/components/landing/CallToAction";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <ValueProposition />
        <ProcessSection />
        <FeatureGrid />
        <CaseStudySection />
        <PricingSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
