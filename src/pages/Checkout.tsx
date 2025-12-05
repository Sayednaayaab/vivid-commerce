import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { ShippingAddress, PaymentMethod } from "@/types/order";
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Truck, 
  Shield, 
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  Package
} from "lucide-react";
import { toast } from "sonner";

type CheckoutStep = 'shipping' | 'payment' | 'review';

const Checkout = () => {
  const navigate = useNavigate();
const { items, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const [selectedShipping, setSelectedShipping] = useState('standard');

  const shippingOptions = [
    { id: 'standard', name: 'Standard Delivery', price: totalPrice >= 50 ? 0 : 9.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Delivery', price: 14.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Delivery', price: 24.99, days: '1 business day' },
  ];

  const selectedShippingOption = shippingOptions.find(o => o.id === selectedShipping)!;
  const subtotal = totalPrice;
  const shipping = selectedShippingOption.price;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const estimatedDelivery = () => {
    const today = new Date();
    const days = selectedShipping === 'overnight' ? 1 : selectedShipping === 'express' ? 3 : 7;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + days);
    return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleShippingSubmit = () => {
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.email || 
        !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error("Please fill in all card details");
        return;
      }
    }
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const order = addOrder(items, shippingAddress, paymentMethod, subtotal);
    clearCart();
    
    toast.success("Order placed successfully!");
    navigate(`/order-confirmation/${order.id}`);
  };

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'debit_card', name: 'Debit Card', icon: CreditCard, description: 'Direct bank debit' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, description: 'Fast & secure checkout' },
    { id: 'apple_pay', name: 'Apple Pay', icon: Wallet, description: 'Pay with Face ID or Touch ID' },
    { id: 'google_pay', name: 'Google Pay', icon: Wallet, description: 'Quick mobile payment' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to checkout</p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {['shipping', 'payment', 'review'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                currentStep === step 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : ['shipping', 'payment', 'review'].indexOf(currentStep) > index
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground text-muted-foreground'
              }`}>
                {['shipping', 'payment', 'review'].indexOf(currentStep) > index ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 font-medium capitalize ${
                currentStep === step ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
              {index < 2 && (
                <div className={`w-20 h-0.5 mx-4 ${
                  ['shipping', 'payment', 'review'].indexOf(currentStep) > index 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="apartment">Apartment, Suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      value={shippingAddress.apartment}
                      onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedShipping === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedShipping(option.id)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div>
                          <Label htmlFor={option.id} className="font-medium cursor-pointer">
                            {option.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.days}</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </RadioGroup>

                <Button onClick={handleShippingSubmit} className="w-full mt-6" size="lg">
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Button 
                  variant="ghost" 
                  className="mb-4"
                  onClick={() => setCurrentStep('shipping')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shipping
                </Button>

                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          paymentMethod === method.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="w-6 h-6 text-primary" />
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div className="bg-muted/50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardHolder">Cardholder Name *</Label>
                        <Input
                          id="cardHolder"
                          placeholder="John Doe"
                          value={cardDetails.cardHolder}
                          onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="saveCard"
                          checked={cardDetails.saveCard}
                          onCheckedChange={(checked) => setCardDetails({...cardDetails, saveCard: checked as boolean})}
                        />
                        <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                          Save card for future purchases
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="bg-muted/50 rounded-xl p-6 mb-6 text-center">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}

                {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
                  <div className="bg-muted/50 rounded-xl p-6 mb-6 text-center">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">
                      Click continue to pay with {paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}.
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-muted/50 rounded-xl p-6 mb-6">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground text-center">
                      Bank transfer details will be provided after order confirmation.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <Button onClick={handlePaymentSubmit} className="w-full" size="lg">
                  Review Order
                </Button>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Button 
                  variant="ghost" 
                  className="mb-4"
                  onClick={() => setCurrentStep('payment')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Payment
                </Button>

                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                {/* Shipping Address */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Shipping Address</h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                    <p className="text-muted-foreground">{shippingAddress.address}</p>
                    {shippingAddress.apartment && <p className="text-muted-foreground">{shippingAddress.apartment}</p>}
                    <p className="text-muted-foreground">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p className="text-muted-foreground">{shippingAddress.country}</p>
                    <p className="text-muted-foreground mt-2">{shippingAddress.email}</p>
                    <p className="text-muted-foreground">{shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Delivery Date */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Estimated Delivery</h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium text-primary">{estimatedDelivery()}</p>
                    <p className="text-sm text-muted-foreground">{selectedShippingOption.name} - {selectedShippingOption.days}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Payment Method</h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium capitalize">{paymentMethod.replace('_', ' ')}</p>
                    {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && cardDetails.cardNumber && (
                      <p className="text-muted-foreground">**** **** **** {cardDetails.cardNumber.slice(-4)}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Order Items ({items.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 bg-muted/50 rounded-lg p-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                            {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            {item.selectedColor && ` • Color: ${item.selectedColor}`}
                          </p>
                        </div>
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder} 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>Place Order - ${total.toFixed(2)}</>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price}</p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-muted-foreground">+{items.length - 3} more items</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {totalPrice >= 50 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                  <Truck className="w-4 h-4" />
                  <span>You qualify for free shipping!</span>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Free returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
