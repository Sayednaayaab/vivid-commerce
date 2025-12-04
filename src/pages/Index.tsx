import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main>
        <HeroSection />
        <CategoriesSection />
        <ProductGridSection 
          title="Featured Products" 
          subtitle="Hand-picked favorites from our collection"
          type="featured"
        />
        <FlashSaleSection />
        <ProductGridSection 
          title="New Arrivals" 
          subtitle="Fresh styles just landed"
          type="new"
        />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
