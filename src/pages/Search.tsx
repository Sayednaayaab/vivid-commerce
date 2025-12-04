import { useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X, TrendingUp, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";

const popularSearches = ["Leather Jacket", "Headphones", "Smartwatch", "Sneakers", "Dress"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "wireless headphones",
    "leather bag",
  ]);

  const filteredProducts = query.length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm && !recentSearches.includes(searchTerm.toLowerCase())) {
      setRecentSearches((prev) => [searchTerm.toLowerCase(), ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-20">
        <div className="container py-8">
          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for products, brands, or categories..."
                className="h-14 pl-12 pr-12 text-lg rounded-xl"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setQuery("")}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Results or Suggestions */}
          {query.length > 1 ? (
            <div>
              <p className="text-muted-foreground mb-6">
                {filteredProducts.length} results for "{query}"
              </p>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline" onClick={() => setQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium">Recent Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="px-4 py-2 text-sm bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">Trending Now</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-medium mb-4">Browse Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Link
                    to="/products/men"
                    className="p-4 bg-secondary rounded-xl text-center hover:bg-secondary/80 transition-colors"
                  >
                    Men
                  </Link>
                  <Link
                    to="/products/women"
                    className="p-4 bg-secondary rounded-xl text-center hover:bg-secondary/80 transition-colors"
                  >
                    Women
                  </Link>
                  <Link
                    to="/products/electronics"
                    className="p-4 bg-secondary rounded-xl text-center hover:bg-secondary/80 transition-colors"
                  >
                    Electronics
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
