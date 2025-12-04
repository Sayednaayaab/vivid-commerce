import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts, getNewArrivals } from "@/data/products";

interface ProductGridSectionProps {
  title: string;
  subtitle?: string;
  type: "featured" | "new";
  showViewAll?: boolean;
}

export function ProductGridSection({ title, subtitle, type, showViewAll = true }: ProductGridSectionProps) {
  const products = type === "featured" ? getFeaturedProducts() : getNewArrivals();

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          {showViewAll && (
            <Link to="/products">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 4).map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
