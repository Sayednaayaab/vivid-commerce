import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Heart, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  ChevronRight,
  Check
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success("Added to bag!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/products/${product.category}`} className="hover:text-foreground transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
                {product.discount && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold bg-destructive text-destructive-foreground rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-20 h-24 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-2 py-1 text-sm font-semibold bg-destructive/10 text-destructive rounded-md">
                      Save ${product.originalPrice! - product.price}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">
                    Color: <span className="text-muted-foreground">{selectedColor || "Select"}</span>
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                          selectedColor === color.name
                            ? "border-primary scale-110"
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className={cn(
                            "w-4 h-4",
                            color.hex === "#FFFFFF" || color.hex === "#F7E7CE" || color.hex === "#FFFDD0"
                              ? "text-foreground"
                              : "text-white"
                          )} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">
                      Size: <span className="text-muted-foreground">{selectedSize || "Select"}</span>
                    </p>
                    <button className="text-sm text-primary hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Bag
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    toggleItem(product);
                    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className={cn(isWishlisted && "text-destructive border-destructive")}
                >
                  <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-display font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
