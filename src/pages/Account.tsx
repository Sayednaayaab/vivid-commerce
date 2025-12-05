import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

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
        </div>
      </div>
    </div>
  );
};

export default Account;
