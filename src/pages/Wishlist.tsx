import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product);
    removeItem(product.id);
    toast.success("Moved to bag!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-20">
        <div className="container py-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">{items.length} items saved</p>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding items you love to your wishlist
              </p>
              <Link to="/products">
                <Button variant="hero">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {items.map((product) => (
                <div key={product.id} className="group relative">
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative overflow-hidden rounded-2xl bg-secondary/30"
                  >
                    <div className="aspect-[3/4] relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Button
                      variant="icon"
                      size="icon"
                      className="bg-background/80 backdrop-blur-sm text-destructive"
                      onClick={() => {
                        removeItem(product.id);
                        toast.success("Removed from wishlist");
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {product.brand}
                    </p>
                    <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through text-sm">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Move to Bag
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
