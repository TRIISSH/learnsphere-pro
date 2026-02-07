import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DollarSign, Loader2, ArrowRight, TrendingUp, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(100),
});

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignUp) {
        const parsed = signupSchema.parse({ email, password, name });
        const { error } = await signUp(parsed.email, parsed.password, parsed.name);
        if (error) {
          toast.error(error.message?.includes("already registered") ? "This email is already registered." : error.message);
        } else {
          toast.success("Account created! Check your email to verify, then sign in.");
          setIsSignUp(false);
        }
      } else {
        const parsed = loginSchema.parse({ email, password });
        const { error } = await signIn(parsed.email, parsed.password);
        if (error) toast.error("Invalid email or password");
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    { icon: TrendingUp, title: "Track Progress", desc: "Monitor your financial literacy growth" },
    { icon: BarChart3, title: "Smart Analytics", desc: "Data-driven insights on your learning" },
    { icon: Shield, title: "Expert Content", desc: "Curated by finance professionals" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden items-center justify-center finance-grid">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />

        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <DollarSign className="h-5 w-5 text-accent" />
              <span className="text-accent font-heading font-semibold">WealthPath</span>
            </div>
            <h1 className="font-heading text-4xl font-bold text-sidebar-foreground mb-4">
              Build Your <span className="text-gradient">Financial Future</span>
            </h1>
            <p className="text-sidebar-foreground/50 text-lg max-w-md mx-auto">
              Master personal finance, investing, and wealth management with our structured courses.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-4 px-5 py-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border text-left"
              >
                <div className="p-2 rounded-lg bg-accent/10">
                  <f.icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{f.title}</p>
                  <p className="text-xs text-sidebar-foreground/40">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <DollarSign className="h-7 w-7 text-accent" />
            <h1 className="font-heading text-2xl font-bold text-accent">WealthPath</h1>
          </div>

          <h2 className="font-heading text-3xl font-bold mb-2">
            {isSignUp ? "Start Investing in Yourself" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp ? "Create your account to begin building financial knowledge" : "Sign in to continue your financial education"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Warren Buffett" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="investor@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold gap-2 bg-accent text-accent-foreground hover:bg-accent/90" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-accent font-medium hover:underline">
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
