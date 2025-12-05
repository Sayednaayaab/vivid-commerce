import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { Separator } from "@/components/ui/separator";

const Account = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const usersRaw = typeof window !== "undefined" ? localStorage.getItem("auth_users") : null;
  const users = usersRaw ? JSON.parse(usersRaw) : {};
  const user = userEmail && users[userEmail] ? users[userEmail] : null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || (userEmail === "guest" ? "Guest" : userEmail) || "User";
  const { orders } = useOrders();

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{(displayName || "U").charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{displayName}</CardTitle>
                  <CardDescription className="text-sm">Manage your account and session</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-base">{userEmail === "guest" ? "(guest)" : userEmail || "-"}</div>
                </div>

                {user?.name && (
                  <div>
                    <div className="text-sm text-muted-foreground">Full name</div>
                    <div className="text-base">{user.name}</div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <div className="w-full flex justify-end">
                <Button variant="outline" onClick={() => navigate("/home")} className="mr-2">Go to shop</Button>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </div>
            </CardFooter>
          </Card>

          {/* My Orders */}
          <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 text-center">You have no orders yet.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-card rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{o.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{o.items.length} items • {new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{o.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{o.status.replace('_',' ')}</p>
                      </div>
                    </div>
                    <Separator className="mb-3" />
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0">
                          <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border border-border">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=Product";
                              }}
                            />
                            {item.quantity > 1 && (
                              <div className="absolute bottom-1 right-1 bg-slate-900 text-white text-xs rounded px-1">
                                ×{item.quantity}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-center truncate w-20">{item.productName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
