import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import ProductPreview from "@/components/landing/ProductPreview";


export default function HomePage() {
  return (
    <div className="min-h-screen stars-bg" style={{ background: "#020617" }}>

      {/* Ambient blobs */}
      <div className="ambient" style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div className="blob" style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", top: -200, left: "15%", width: 600, height: 600, background: "radial-gradient(circle,rgba(139,92,246,.07),transparent)" }} />
        <div className="blob" style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", top: "40%", right: -100, width: 500, height: 500, background: "radial-gradient(circle,rgba(245,158,11,.05),transparent)" }} />
        <div className="blob" style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", bottom: 0, left: "30%", width: 400, height: 400, background: "radial-gradient(circle,rgba(244,63,94,.04),transparent)" }} />
      </div>

      {/* ===== HEADER ===== */}
      <LandingHeader />

      {/* ===== HERO ===== */}
      <Hero />

      {/* ===== PREVIEW ===== */}
      <ProductPreview />

      {/* ===== FEATURES ===== */}
      <Features />

      {/* ===== PRICING ===== */}
      <Pricing />

      {/* ===== TESTIMONIALS ===== */}
      <Testimonials />

      {/* ===== CTA FINAL ===== */}
      <CTA />

    </div>
  );
}
