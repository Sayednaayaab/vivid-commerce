import React, { useState, useEffect, useRef } from "react";
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

  // Google Identity Services setup
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return; // user must provide a client id in env

    const existing = (window as any).google;
    function initGsi() {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            try {
              const credential = response?.credential;
              if (!credential) return;
              const payload = JSON.parse(atob(credential.split(".")[1]));
              const email = payload?.email;
              if (email) {
                auth.login(email);
                toast({ title: "Signed in with Google", description: `Welcome ${payload.name || email}` });
                navigate("/home");
              }
            } catch (err) {
              console.warn("Google sign-in parse error", err);
            }
          },
        });

        if (googleButtonRef.current) {
          (window as any).google.accounts.id.renderButton(googleButtonRef.current, { theme: "outline", size: "large" });
        }
      } catch (e) {
        // ignore
      }
    }

    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.head.appendChild(script);
      return () => { document.head.removeChild(script); };
    } else {
      initGsi();
    }
  }, [auth, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-4xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left decorative panel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 items-center justify-center">
            <div className="space-y-4 max-w-sm">
              <h2 className="text-3xl font-semibold">{mode === "login" ? "Welcome back" : "Welcome"}</h2>
              <p className="text-sm opacity-90">{mode === "login" ? "Sign in to access your orders, wishlist and fast checkout." : "Create an account to save addresses, track orders and receive offers."}</p>
              <div className="mt-6">
                <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                  <rect x="8" y="20" width="144" height="88" rx="10" fill="rgba(255,255,255,0.06)" />
                  <circle cx="40" cy="54" r="10" fill="rgba(255,255,255,0.14)" />
                  <rect x="62" y="48" width="70" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
                  <rect x="62" y="60" width="50" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="w-full md:w-1/2 p-8 bg-white">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold transition-all duration-500">{mode === "login" ? "Sign in to your account" : "Create your account"}</h3>
                <p className="text-sm text-muted-foreground mt-1 transition-opacity duration-500">{mode === "login" ? "Enter your credentials to continue" : "Fill details to create a new account"}</p>
              </div>

              <div className="flex items-center gap-3 mb-6 bg-slate-50 p-1 rounded-md w-full transition-all duration-300">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${mode === "login" ? "bg-white shadow-sm" : "text-muted-foreground"}`}>
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${mode === "signup" ? "bg-white shadow-sm" : "text-muted-foreground"}`}>
                  Sign up
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className={`space-y-2 transform transition-all duration-500 ${mode === "signup" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`} aria-hidden={mode !== "signup"}>
                  <Label className="block mb-1">Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>

                <div className="space-y-2">
                  <Label className="block mb-1">Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>

                <div className="space-y-2">
                  <Label className="block mb-1">Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                  <Button type="submit" className="flex-1 py-2">{mode === "login" ? "Sign in" : "Create account"}</Button>
                  <Button variant="ghost" onClick={guest} className="w-full sm:w-auto">Continue as guest</Button>
                </div>
              </form>

              <div className="mt-4">
                {((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) && (
                  <div className="mb-4">
                    <div className="text-center text-sm text-muted-foreground mb-3">Or continue with</div>
                    <div ref={googleButtonRef} className="flex justify-center" />
                  </div>
                )}
                <div className="text-sm text-muted-foreground text-center">By continuing you agree to our terms and privacy.</div>
                {!((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) && (
                  <details className="mt-4 text-xs text-muted-foreground cursor-pointer">
                    <summary className="font-medium">Want to enable Google sign-in?</summary>
                    <div className="mt-2 p-2 bg-slate-50 rounded text-left">
                      <p className="mb-2">1. Get a Client ID from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></p>
                      <p className="mb-2">2. Add to your <code className="bg-white p-1 rounded">.env</code> file:</p>
                      <code className="block bg-white p-2 rounded border text-xs mb-2">VITE_GOOGLE_CLIENT_ID=your-client-id</code>
                      <p>3. Restart your dev server</p>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
