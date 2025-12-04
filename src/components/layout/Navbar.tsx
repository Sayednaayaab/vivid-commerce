import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toggleCart, getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50"
            : "bg-transparent"
        )}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl lg:text-3xl font-display font-bold tracking-tight">
                <span className="gradient-text">LUXE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(category.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={`/products/${category.slug}`}
                    className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-6"
                  >
                    {category.name}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </Link>
                  
                  {/* Mega Menu */}
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                    )}
                  >
                    <div className="glass rounded-xl p-6 min-w-[200px] shadow-lg animate-fade-in">
                      <ul className="space-y-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={`/products/${category.slug}/${sub.slug}`}
                              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to="/search">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/wishlist" className="relative">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                <ShoppingBag className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </Button>

              <Link to="/account" className="hidden sm:block">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          isMobileMenuOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-full max-w-sm bg-background shadow-xl transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-xl font-display font-bold gradient-text">LUXE</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                <Link
                  to={`/products/${category.slug}`}
                  className="block px-4 py-3 font-medium hover:bg-secondary rounded-lg transition-colors"
                >
                  {category.name}
                </Link>
                <div className="pl-4 space-y-1">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/products/${category.slug}/${sub.slug}`}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
