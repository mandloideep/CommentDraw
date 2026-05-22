import {
  Header,
  Footer,
  HeroSection,
  WorkingSection,
  FeaturesSection,
  SubscriptionSection as Subscription,
  CTA as CTASection,
  FAQSection as FAQ,
} from "../../components/landing";

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorkingSection />
        <FeaturesSection />
        <Subscription />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
