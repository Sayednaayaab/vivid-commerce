import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const priceRanges = [
  { value: "0-100", label: "Under $100" },
  { value: "100-250", label: "$100 - $250" },
  { value: "250-500", label: "$250 - $500" },
  { value: "500+", label: "$500+" },
];

export default function Products() {
  const { category, subcategory } = useParams();
  const [sortBy, setSortBy] = useState("featured");
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  const currentCategory = categories.find((c) => c.slug === category);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by subcategory
    if (subcategory) {
      filtered = filtered.filter((p) => p.subcategory === subcategory);
    }

    // Filter by price
    if (selectedPrices.length > 0) {
      filtered = filtered.filter((p) => {
        return selectedPrices.some((range) => {
          if (range === "0-100") return p.price < 100;
          if (range === "100-250") return p.price >= 100 && p.price < 250;
          if (range === "250-500") return p.price >= 250 && p.price < 500;
          if (range === "500+") return p.price >= 500;
          return true;
        });
      });
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [category, subcategory, selectedPrices, sortBy]);

  const togglePrice = (value: string) => {
    setSelectedPrices((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedPrices([]);
  };

  const pageTitle = subcategory
    ? currentCategory?.subcategories.find((s) => s.slug === subcategory)?.name
    : currentCategory?.name || "All Products";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-20">
        {/* Hero Banner */}
        <div className="relative h-48 lg:h-64 bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          {currentCategory && (
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="container relative h-full flex flex-col justify-center">
            <h1 className="text-3xl lg:text-5xl font-display font-bold mb-2">{pageTitle}</h1>
            <p className="text-muted-foreground">{filteredProducts.length} products</p>
          </div>
        </div>

        <div className="container py-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {selectedPrices.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {selectedPrices.length}
                  </span>
                )}
              </Button>

              {selectedPrices.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                  <X className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Grid Toggle */}
              <div className="hidden lg:flex items-center gap-1 p-1 bg-secondary rounded-lg">
                <Button
                  variant={gridCols === 2 ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(2)}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={gridCols === 3 ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(3)}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={gridCols === 4 ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(4)}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-secondary border-0 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside
              className={cn(
                "w-64 shrink-0",
                "hidden lg:block",
                showFilters && "fixed inset-0 z-50 bg-background p-6 lg:relative lg:p-0 block"
              )}
            >
              {showFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              )}

              {/* Make the categories/price sections sticky on large screens */}
              <div className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
                {/* Categories */}
                {currentCategory && (
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <ul className="space-y-2">
                      {currentCategory.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <a
                            href={`/products/${category}/${sub.slug}`}
                            className={cn(
                              "text-sm transition-colors",
                              subcategory === sub.slug
                                ? "text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPrices.includes(range.value)}
                          onChange={() => togglePrice(range.value)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {showFilters && (
                  <Button
                    variant="hero"
                    className="w-full mt-6 lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-4 lg:gap-6",
                    gridCols === 2 && "grid-cols-2",
                    gridCols === 3 && "grid-cols-2 lg:grid-cols-3",
                    gridCols === 4 && "grid-cols-2 lg:grid-cols-4"
                  )}
                >
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-up opacity-0"
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
