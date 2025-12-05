import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { randomSalt, hashWithSalt } from "@/lib/crypto";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    const emailTrim = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters." });
      return;
    }

    const usersRaw = localStorage.getItem("auth_users");
    const users = usersRaw ? JSON.parse(usersRaw) : {};

    if (mode === "signup") {
      if (users[emailTrim]) {
        toast({ title: "Email taken", description: "An account with that email already exists." });
        return;
      }

      const salt = await randomSalt(16);
      const hash = await hashWithSalt(password, salt);
      users[emailTrim] = { name: name.trim() || null, salt, hash };
      localStorage.setItem("auth_users", JSON.stringify(users));
      auth.login(emailTrim);
      toast({ title: "Account created", description: "You are now signed up and logged in." });
      navigate("/home");
      return;
    }

    // login flow
    const user = users[emailTrim];
    if (!user) {
      toast({ title: "Not found", description: "No account found for this email." });
      return;
    }

    const hash = await hashWithSalt(password, user.salt);
    if (hash === user.hash) {
      auth.login(emailTrim);
      toast({ title: "Signed in", description: "Welcome back." });
      navigate("/home");
    } else {
      toast({ title: "Incorrect credentials", description: "Email or password is incorrect." });
    }
  };

  const guest = () => {
    // Mark as guest session
    auth.login("guest");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{mode === "login" ? "Welcome back" : "Create an account"}</CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to continue to our store"
                : "Sign up to start shopping with an account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button variant={mode === "login" ? "hero" : "outline"} size="sm" onClick={() => setMode("login")}>Login</Button>
              <Button variant={mode === "signup" ? "hero" : "outline"} size="sm" onClick={() => setMode("signup")}>Sign up</Button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <Label className="block mb-1">Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
              )}

              <div>
                <Label className="block mb-1">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>

              <div>
                <Label className="block mb-1">Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button type="submit" className="flex-1">{mode === "login" ? "Sign in" : "Create account"}</Button>
                <Button variant="ghost" onClick={guest}>Continue as guest</Button>
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <div className="text-sm text-muted-foreground w-full text-center">
              By continuing you agree to our terms and privacy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
