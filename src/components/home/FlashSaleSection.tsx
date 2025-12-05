import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saleProducts = products.filter((p) => p.discount).slice(0, 3);

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Flash Sale
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
              Limited Time Offers
            </h2>
            <p className="text-muted-foreground">Don't miss out on these amazing deals</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-background rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl lg:text-3xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">Hours</span>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">:</span>
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-background rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl lg:text-3xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">Minutes</span>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">:</span>
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-background rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl lg:text-3xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">Seconds</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {saleProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative bg-background rounded-2xl overflow-hidden hover-lift"
            >
              <div className="flex">
                <div className="w-1/2 aspect-square">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="w-1/2 p-4 lg:p-6 flex flex-col justify-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="font-medium mt-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg font-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="inline-flex items-center mt-2 px-2 py-1 text-xs font-semibold bg-destructive/10 text-destructive rounded-full w-fit">
                      Save {product.discount}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="outline" size="lg" className="group">
              View All Deals
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
