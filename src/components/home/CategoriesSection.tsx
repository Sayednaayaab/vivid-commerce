import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our curated collections across fashion and electronics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products/${category.slug}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl aspect-[4/5] hover-lift",
                "animate-fade-up opacity-0"
              )}
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-background">
                <h3 className="text-2xl font-display font-bold mb-2">{category.name}</h3>
                <div className="flex items-center gap-2 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.slug}
                      className="px-3 py-1 text-xs bg-background/20 backdrop-blur-sm rounded-full"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
