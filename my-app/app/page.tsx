'use client';

import HeroSection from "./Sections/Hero";

import HowItWorks from "./Sections/HowItWorks";

import FeaturedRecommendations from "./Sections/Recommendation";

import SuccessStories from "./Sections/Stories";

import UpcomingChallenges from "./Sections/UpcomingChallenges";

import ContactExperts from "./Sections/Contact";

import Header from "./Sections/Header";

import Footer from "./Sections/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <FeaturedRecommendations />
      <SuccessStories />
      <UpcomingChallenges />
      <ContactExperts />
      <Header />
      <Footer />
    </main>
  );
}