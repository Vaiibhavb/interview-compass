/**
 * =============================================
 * Login Page
 * Secure login with role-based redirection
 * Dummy auth — any password works with valid emails
 * =============================================
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);
    setIsLoading(false);

    if (success) {
      toast({ title: "Welcome back!", description: "Login successful." });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Try: admin@company.com, james@company.com, or maria@company.com",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Login card with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Branding header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <LogIn className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl text-foreground">Interview Tracker</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage interviews</p>
        </div>

        {/* Login form */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            {/* Password field with show/hide toggle */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-lg bg-accent p-4 text-xs text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">Demo Accounts (any password):</p>
            <p>Admin: admin@company.com</p>
            <p>Tech Interviewer: james@company.com</p>
            <p>HR: maria@company.com</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
