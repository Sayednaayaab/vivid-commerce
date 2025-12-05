import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

export function Footer() {
  const [open, setOpen] = useState(false);
  const [modalKey, setModalKey] = useState<string | null>(null);

  const contentMap: Record<string, { title: string; body: React.ReactNode }> = {
    contact: {
      title: "Contact Us",
      body: (
        <div className="space-y-4">
          <p className="leading-relaxed">Our support team is available Mon–Fri, 9am–6pm ET. We reply to most messages within 24 hours.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium">Customer Care</p>
              <p className="text-sm text-muted-foreground">Phone: <a href="tel:+15551234567" className="underline">+1 (555) 123-4567</a></p>
              <p className="text-sm text-muted-foreground">Email: <a href="mailto:hello@luxe.com" className="underline">hello@luxe.com</a></p>
            </div>
            <div>
              <p className="text-sm font-medium">Warehouse</p>
              <p className="text-sm text-muted-foreground">123 Fashion Ave, New York, NY 10001</p>
              <p className="text-sm text-muted-foreground">Mon–Fri: 9am–5pm</p>
            </div>
          </div>
          <div className="pt-2">
            <Button asChild>
              <a href="/contact" className="w-full inline-block text-center">Open full contact page</a>
            </Button>
          </div>
        </div>
      ),
    },
    shipping: {
      title: "Shipping Info",
      body: (
        <div className="space-y-3">
          <p className="leading-relaxed">We ship worldwide with tracked carriers. Orders are processed within 1–2 business days.</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>Standard (free over ₹2,999): 5–8 business days</li>
            <li>Express: 2–4 business days (additional fees may apply)</li>
            <li>Order tracking available via the Orders page after shipment</li>
          </ul>
          <p className="text-sm">Duties and taxes on international shipments may apply and are the responsibility of the recipient.</p>
          <div className="pt-2">
            <Button asChild>
              <a href="/shipping" className="w-full inline-block text-center">See full shipping policy</a>
            </Button>
          </div>
        </div>
      ),
    },
    returns: {
      title: "Returns & Exchanges",
      body: (
        <div className="space-y-3">
          <p className="leading-relaxed">We accept returns within 30 days of delivery for most items. Items must be unworn and in original condition.</p>
          <ol className="list-decimal pl-5 text-sm text-muted-foreground">
            <li>Open your Orders page and select the order</li>
            <li>Choose the item(s) and request a return or exchange</li>
            <li>Print the pre-paid return label (if provided) and drop off at the carrier</li>
          </ol>
          <p className="text-sm">Refunds are issued within 5–7 business days after we receive the return. Some items (final sale) are ineligible—check the product page.</p>
        </div>
      ),
    },
    faq: {
      title: "FAQ",
      body: (
        <div className="space-y-3">
          <details className="group">
            <summary className="cursor-pointer font-medium">How long until my order ships?</summary>
            <p className="text-sm text-muted-foreground mt-2">Most orders ship within 1–2 business days.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium">Can I cancel my order?</summary>
            <p className="text-sm text-muted-foreground mt-2">Orders can be cancelled within 30 minutes of placement; contact support immediately.</p>
          </details>
          <p className="text-sm text-muted-foreground">If you don't find an answer here, open the full FAQ page or contact support.</p>
        </div>
      ),
    },
    size: {
      title: "Size Guide",
      body: (
        <div className="space-y-3">
          <p className="leading-relaxed">Sizes vary between categories. Below are general measurements to help choose your size.</p>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-muted-foreground"><th>Size</th><th>Bust / Chest (cm)</th><th>Waist (cm)</th></tr>
            </thead>
            <tbody>
              <tr><td>XS</td><td>78–84</td><td>60–66</td></tr>
              <tr><td>S</td><td>84–90</td><td>66–72</td></tr>
              <tr><td>M</td><td>90–96</td><td>72–78</td></tr>
              <tr><td>L</td><td>96–102</td><td>78–86</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-muted-foreground">For footwear and specific product measurements, check the product page for a detailed chart.</p>
        </div>
      ),
    },
    about: {
      title: "About Us",
      body: (
        <div className="space-y-2">
          <p>Founded in 2020, LUXE curates premium fashion and tech for the modern lifestyle. Our mission is to bring quality, sustainability, and style together.</p>
          <p className="text-sm text-muted-foreground">We partner with ethical suppliers and focus on long-lasting products.</p>
        </div>
      ),
    },
    careers: {
      title: "Careers",
      body: (
        <div className="space-y-2">
          <p>We're growing — join us! Popular roles include Frontend Engineer, Product Manager, and Customer Experience Specialist.</p>
          <p className="text-sm text-muted-foreground">Submit CVs to <a href="mailto:jobs@luxe.com" className="underline">jobs@luxe.com</a></p>
        </div>
      ),
    },
    press: {
      title: "Press",
      body: (
        <div className="space-y-2">
          <p>For press inquiries, partnerships, or images, contact our press team at <a href="mailto:press@luxe.com" className="underline">press@luxe.com</a>.</p>
          <p className="text-sm text-muted-foreground">High-res logos and product images are available on request.</p>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div className="space-y-2">
          <p>We collect only the information necessary to process orders and improve your experience. We never sell your personal data.</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>Account data: email and name</li>
            <li>Order data: items, shipping, payment status</li>
            <li>Analytics: anonymous usage data to improve the site</li>
          </ul>
          <p className="text-sm">Read the full policy on the Privacy page.</p>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      body: (
        <div className="space-y-2">
          <p>Our terms cover purchases, returns, and intellectual property. Key points:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>Prices are subject to change until order confirmation</li>
            <li>We reserve the right to cancel orders for inventory or pricing errors</li>
            <li>Payment and billing must be valid for the order to be processed</li>
          </ul>
          <p className="text-sm">See the full Terms page for complete details.</p>
        </div>
      ),
    },
  };

  function openModal(key: string) {
    setModalKey(key);
    setOpen(true);
  }

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3">
              Join the <span className="gradient-text">LUXE</span> Club
            </h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to get exclusive offers, early access to new arrivals, and 10% off your first order.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12"
              />
              <Button variant="hero" className="h-12">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Info Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalKey ? contentMap[modalKey].title : "Info"}</DialogTitle>
            <DialogDescription>
              {modalKey ? contentMap[modalKey].body : null}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold gradient-text">LUXE</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Premium fashion and electronics for the modern lifestyle.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products/men" className="text-muted-foreground hover:text-foreground transition-colors">Men</Link></li>
              <li><Link to="/products/women" className="text-muted-foreground hover:text-foreground transition-colors">Women</Link></li>
              <li><Link to="/products/electronics" className="text-muted-foreground hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => openModal("contact")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Contact Us</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("shipping")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Shipping Info</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("returns")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Returns & Exchanges</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("faq")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">FAQ</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("size")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Size Guide</button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => openModal("about")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">About Us</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("careers")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Careers</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("press")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Press</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("privacy")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Privacy Policy</button>
              </li>
              <li>
                <button type="button" onClick={() => openModal("terms")} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">Terms of Service</button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@luxe.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 LUXE. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-6 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="Mastercard" className="h-6 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" alt="PayPal" className="h-6 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/128/5968/5968299.png" alt="Apple Pay" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
