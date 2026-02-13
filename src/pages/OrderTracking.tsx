import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/types/order";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Calendar,
  Search,
  ArrowRight,
  Box,
  Home
} from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pending: { label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500' },
  processing: { label: 'Processing', icon: Package, color: 'text-purple-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-indigo-500' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'text-orange-500' },
  delivered: { label: 'Delivered', icon: Home, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: Clock, color: 'text-red-500' },
};

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const OrderTracking = () => {
  const { orderId } = useParams();
  const { getOrder, getOrderByNumber, orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');

  const order = orderId ? getOrder(orderId) : searchedOrder;

  const handleSearch = () => {
    setSearchError('');
    const found = getOrderByNumber(searchQuery) || getOrder(searchQuery);
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchError('Order not found. Please check your order number or tracking number.');
      setSearchedOrder(null);
    }
  };

  const getCurrentStatusIndex = (status: OrderStatus) => {
    return statusOrder.indexOf(status);
  };

  const getProgressPercentage = (status: OrderStatus) => {
    const index = getCurrentStatusIndex(status);
    if (index === -1) return 0;
    return ((index + 1) / statusOrder.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Track Your Order</h1>

          {/* Search Section */}
          {!orderId && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Enter Order or Tracking Number</h2>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g., ORD-XXXXX or TRK123456789"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </Button>
              </div>
              {searchError && (
                <p className="text-destructive text-sm mt-2">{searchError}</p>
              )}

              {/* Recent Orders */}
              {orders.length > 0 && !searchedOrder && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Orders</h3>
                  <div className="space-y-2">
                    {orders.slice(0, 3).map((o) => (
                      <Link
                        key={o.id}
                        to={`/order-tracking/${o.id}`}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{o.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(o.createdAt).toLocaleDateString()} • {o.items.length} items
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${statusConfig[o.status].color}`}>
                            {statusConfig[o.status].label}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Tracking Details */}
          {order && (
            <>
              {/* Order Header */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="text-2xl font-bold">{order.orderNumber}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="text-xl font-mono">{order.trackingNumber}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 dark:bg-green-950/50' :
                  order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-950/50' :
                  'bg-primary/10'
                }`}>
                  {(() => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return <StatusIcon className={`w-5 h-5 ${statusConfig[order.status].color}`} />;
                  })()}
                  <span className={`font-semibold ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-8">
                <h2 className="text-lg font-semibold mb-6">Delivery Progress</h2>
                
                {/* Progress Bar */}
                <div className="relative mb-8">
                  <div className="h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    />
                  </div>
                  
                  {/* Status Points */}
                  <div className="flex justify-between mt-4">
                    {statusOrder.map((status, index) => {
                      const config = statusConfig[status];
                      const StatusIcon = config.icon;
                      const isActive = getCurrentStatusIndex(order.status) >= index;
                      const isCurrent = order.status === status;
                      
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isActive 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs mt-2 text-center max-w-[60px] ${
                            isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}>
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold text-lg">
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-8">
                <h2 className="text-lg font-semibold mb-6">Tracking History</h2>
                
                <div className="relative">
                  {order.trackingEvents.map((event, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`} />
                        {index < order.trackingEvents.length - 1 && (
                          <div className="w-0.5 flex-1 bg-muted-foreground/30 my-1" />
                        )}
                      </div>
                      
                      {/* Event Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date} at {event.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Order Items */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Address */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </h2>
                  <div className="text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <Separator className="my-3" />
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.email}</p>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5" />
                    Order Items ({order.items.length})
                  </h2>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 mt-8">
                <Button asChild variant="outline">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </>
          )}

          {/* No Order Found */}
          {!order && !orderId && orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to track your orders here</p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
