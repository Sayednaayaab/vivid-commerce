import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className={cn("group relative", className)}>
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-2xl bg-secondary/30">
        <div className="aspect-[3/4] relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 text-xs font-semibold bg-foreground text-background rounded-full">
              NEW
            </span>
          )}
          {product.discount && (
            <span className="px-3 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="icon"
          size="icon"
          className={cn(
            "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/80 backdrop-blur-sm",
            isWishlisted && "opacity-100 text-destructive"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product);
          }}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </Button>

        {/* Quick Add */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="glass"
            className="w-full bg-background/90 backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Bag
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="font-semibold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.name}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
